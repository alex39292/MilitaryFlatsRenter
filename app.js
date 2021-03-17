'use strict';

const { log4js } = require('./utils/log4js');
const logger = log4js.getLogger('bot');
const { startLoop, findHome, getHomes } = require('./models/homes');
const { createUser, changeState, setCity, getCityById, getUsers, getUsersId, deleteUser } = require('./models/users');
const { Telegraf, Markup } = require('telegraf');
const configs = require('./configs/bot');
const bot = new Telegraf('1691534515:AAFJR6hh6POubgyzPCesttZ-b9CXpDfYEog');
const EventObserver = require('./services/observer');
const observer = new EventObserver(broadcast);
const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const app = express();

startLoop(observer);

bot.start(async ctx => {
    const user = ctx.message.from;
    logger.info(`User [${user.id}] started bot`);
    await createUser(user.id, user.username);
    if (user.is_bot) {
        await changeState(user.id, 'BOT');
        return bot.stop('SIGINT');
    }
    return ctx.reply('Введите населенный пункт для поиска');
});

bot.on('message', async ctx => {
    const id = ctx.message.from.id;
    const city = ctx.message.text;
    if (!/[^\.~`!#$%\^&*№+=\-\[\]\\';,/{}|\\":<>\?a-zA-Z0-9]/.test(city)) {
        return ctx.reply(`Не верно введен город. Пример: Минск`);
    }
    logger.info(`User [${id}] added city name ${city}`);
    await changeState(id, 'RUN');
    observer.unsubscribe(id);
    await setCity(id, city);
    const message = await findHome(city);
    if (message === '') {
        await ctx.reply(`Нет квартир в г.${city}`);
        return ctx.reply('Подписаться на обновление?',
            Markup.inlineKeyboard([
                Markup.button.callback('🔔Подписаться', 'Follow')
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
app.use(express.static(__dirname + '/pages'));
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.send(users);
});

app.get('/homes', async (req, res) => {
    const homes = await getHomes();
    res.send(homes);
});

app.get('/message', async (req, res) => {
    res.render('message');
});

app.post('/message', async (req, res) => {
    const result = await sendMessage(req.body.text);
    if (result) {
        res.send('Отправлено');
    } else {
        res.send('Нет пользователей');
    }
});

app.use(bot.webhookCallback('/'));

app.listen(5000, () => {
    logger.info('Listening app on port 5000');
});

async function broadcast(id) {
    const city = await getCityById(id);
    const message = await findHome(city);
        if (message !== '') {
            logger.info(`BROADCAST is working for ${id}`);
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
