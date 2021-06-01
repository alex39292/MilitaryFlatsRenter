'use strict';

const { startLoop, findHome, getHomes } = require('./models/homes');
const { createUser, changeState, setCity, getCityById, getUsers, getUsersId, deleteUser } = require('./models/users');
const { Telegraf, Markup } = require('telegraf');
const configs = require('./configs/bot');
const bot = new Telegraf(process.env.TOKEN);
const EventObserver = require('./services/observer');
const observer = new EventObserver(broadcast);
const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const { webhook } = require('./configs/bot');
const bcrypt = require('bcrypt');
const app = express();

startLoop(observer);

bot.start(async ctx => {
    const user = ctx.message.from;
    console.log(`User [${user.id}] started bot`);
    await createUser(user.id, user.username);
    if (user.is_bot) {
        await changeState(user.id, 'BOT');
        return bot.stop('SIGINT');
    }
    await ctx.reply(`❗️Для поиска введите название населенного пункта.
    ❗️В любой момент можно подписаться/отписаться на автоматическое отслеживание арендного жилья ТОЛЬКО в одном населенном пункте.
    ❗️❗️Во время подписки, при запросе на поиск арендного жилья в ином населенном пункте производиться автоматическая отписка от предыдущего населенного пункта.
    ❓Бот находится в дальнейшей разработке. Предложения/отзывы 
     https://t.me/AlexDanilas`);
    return ctx.reply('Введите населенный пункт для поиска');
});

bot.on('message', async ctx => {
    const id = ctx.message.from.id;
    const city = ctx.message.text;
    if (!/[^\.~`!#$%\^&*№+=\-\[\]\\';,/{}|\\":<>\?a-zA-Z0-9]/.test(city) || city.length < 3) {
        return ctx.reply(`Не верно введен город. Пример: Минск`);
    }
    console.log(`User [${id}] added city name ${city}`);
    await changeState(id, 'RUN');
    observer.unsubscribe(id);
    await setCity(id, city);
    const message = await findHome(city);
    if (message === '') {
        await ctx.reply(`Нет квартир в г.${city}`);
        return ctx.reply('Подписаться на обновление?',
            Markup.inlineKeyboard([
                Markup.button.callback('🔔Подписаться', 'Subscribe')
        ]));
    } else {
    await ctx.reply(message);
    return ctx.reply('Подписаться на обновление?',
        Markup.inlineKeyboard([
            Markup.button.callback('🔔Подписаться', 'Subscribe')
        ]));
    }
});

bot.action('Subscribe', async ctx => {
    const id = ctx.update.callback_query.from.id;
    await changeState(id, 'SUBSCRIBED');
    observer.subscribe(id);
    return ctx.reply('Вы успешно подписались',
    Markup.inlineKeyboard([
        Markup.button.callback('Отписаться от обновления', 'Unsubscribe')
    ]));
});

bot.action('Unsubscribe', async ctx => {
    const id = ctx.update.callback_query.from.id;
    observer.unsubscribe(id);
    await changeState(id, 'RUN');
    await ctx.reply('Вы отписались');
});

bot.telegram.setWebhook(configs.webhook.domain);

app.engine('html', es6Renderer);
app.set('views', './pages');
app.set('view engine', 'html');
app.use(express.json());
app.use(express.static(__dirname + '/pages'));
app.use(express.urlencoded({extended: false}));

app.route('/')
    .get((req, res) => {
        res.render('index');
    })
    .post((req, res) => {
        if (req.body.password) {
            bcrypt.compare(req.body.password, process.env.PASSWORD, (err, result) => {
                if (result) {
                    res.render('home');
                }
            });
        } else {
            res.render('index');
        }
    });

app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.render('users', {locals: {users: users}});
});

app.get('/homes', async (req, res) => {
    const homes = await getHomes();
    res.render('homes', {locals: {homes: homes}});
});

app.route('/message')
    .get((req, res) => {
        res.render('message');
    })
    .post(async (req, res) => {
        const result = await sendMessage(req.body.text);
        if (result) {
            res.render('reqMessage', {locals: {result: 'Отправлено'}});
        } else {
            res.render('reqMessage', {locals: {result: 'Нет пользователей'}});
        }
    });

app.use(bot.webhookCallback('/'));

app.listen(webhook.port, '0.0.0.0', () => {
    console.log(`Listening app on port ${webhook.port}`);
});

async function broadcast(id) {
    const city = await getCityById(id);
    const message = await findHome(city);
        if (message !== '') {
            return bot.telegram.sendMessage(id,'⚡Обновление квартир по подписке⚡\n' + message,
            Markup.inlineKeyboard([
            Markup.button.callback('Отписаться от обновления', 'Unsubscribe')
            ])).catch(async () => await deleteUser(id));
        }
}

async function sendMessage(text) {
    const ids = await getUsersId();
    if (ids.length !== 0) {
        ids.forEach(id => {
            bot.telegram.sendMessage(id, text)
                .catch(async () => await deleteUser(id));
        });
    return true;
    } else {
        return false;
    }
}
