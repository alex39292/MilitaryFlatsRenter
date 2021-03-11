'use strict';

const yargs = require('yargs').argv;
const { log4js } = require('./utils/log4js');
const logger = log4js.getLogger('bot');
const { startLoop, findHome } = require('./models/homes');
const { createUser, changeState, setCity, getCityById } = require('./models/users');
const { Telegraf, Markup } = require('telegraf');
const configs = require('./configs/bot');
const bot = new Telegraf(yargs.token);
const EventObserver = require('./services/observer');
const observer = new EventObserver(broadcast);

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

bot.launch(configs);

async function broadcast(id) {
    const city = await getCityById(id);
    const message = await findHome(city);
        if (message !== '') {
            logger.info(`BROADCAST is working for ${id}`);
            return bot.telegram.sendMessage(id,'⚡Обновление квартир по подписке⚡\n' + message,
            Markup.inlineKeyboard([
            Markup.button.callback('Отписаться от обновления', 'Unsubscribe')
            ]));
        }
}