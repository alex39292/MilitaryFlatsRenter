'use strict';

const yargs = require('yargs').argv;
const { log4js } = require('./utils/log4js');
const logger = log4js.getLogger('bot');
const { startLoop, findHome } = require('./models/homes');
const { getUsers, getUserById, createUser, changeState, insertCity } = require('./models/users');
const { Telegraf, Markup } = require('telegraf');
const configs = require('./configs/bot.json');
const bot = new Telegraf(yargs.token);
const EventObserver = require('./services/observer');
const observer = new EventObserver();

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
    const user = ctx.message.from;
    const city = ctx.message.text;
    if (!/[^\.~`!#$%\^&*№+=\-\[\]\\';,/{}|\\":<>\?a-zA-Z0-9]/.test(city)) {
        return ctx.reply(`Не верно введен город. Пример: Минск`);
    }
    logger.info(`User [${user.id}] added city name ${city}`);
    await changeState(user.id, 'RUN');
    observer.unsubscribe(user.id);
    await insertCity(user.id, city);
    const message = await findHome(city);
    if (message === '') {
        await ctx.reply(`Нет квартир в г.${city}`);
        return ctx.reply('Подписаться на обновление?',
            Markup.inlineKeyboard([
                Markup.button.callback('Подписаться', 'Follow')
        ]));
    } else {
    await ctx.reply(message);
    return ctx.reply('Подписаться на обновление?',
        Markup.inlineKeyboard([
            Markup.button.callback('Подписаться', 'Subscribe')
        ]));
    }
});

bot.action('Subscribe', async (ctx, next) => {
    const id = ctx.update.callback_query.from.id;
    const user = await getUserById(id);
    await changeState(id, 'SUBSCRIBED');
    observer.subscribe({
        user: user,
        ctx: ctx,
        func: broadcast
    });
    await ctx.reply('Вы успешно подписались').then(() => next());
    return ctx.reply('Можно искать в других городах...',
    Markup.inlineKeyboard([
        Markup.button.callback('Отписаться от обновления', 'Unsubscribe')
    ]));
});

bot.action('Unsubscribe', async (ctx, next) => {
    const id = ctx.update.callback_query.from.id;
    const user = await getUserById(id);
    observer.unsubscribe(user.id);
    await changeState(id, 'RUN');
    await ctx.reply('Вы отписались').then(() => next());
})

bot.launch(configs);

async function broadcast(user, ctx) {
    const message = await findHome(user.city);
        if (message !== '') {
            logger.info(`BROADCAST is working for ${user.id}`);
            await ctx.telegram.sendMessage(user.id, message);
        }
}