'use strict';

const yargs = require('yargs').argv;
const { log4js } = require('./utils/log4js');
const logger = log4js.getLogger('bot');
const { startLoop, findHome } = require('./models/homes');
const { getUsers, getUserById, createUser, changeState, insertCity } = require('./models/users');
const Emoji = require('./models/emoji');
const emoji = new Emoji();
const { Telegraf, Markup } = require('telegraf');
const configs = require('./configs/bot.json');
const bot = new Telegraf(yargs.token);

startLoop();

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
    if (!/[^\.~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?a-zA-Z0-9]/.test(city)) {
        return ctx.reply(`Не верно введен город. Пример: Минск`);
    }
    logger.info(`User [${user.id}] added city name ${city}`);
    await changeState(user.id, 'RUN');
    await insertCity(user.id, city);
    const result = await findHome(city);
    if (result.length === 0) {
        await ctx.reply(`Нет квартир в г.${city}`);
        return ctx.reply('Подписаться на обновление?',
            Markup.inlineKeyboard([
                Markup.button.callback('Подписаться', 'Follow')
        ]));
    } else {
        let count = 0;
        let replyMsg = '';
        result.forEach(home => {
replyMsg += `${emoji.generateNumberToSticker(++count)}. ${home.address}
Комнат: ${home.flats}
Этаж: ${home.floor}
Площадь: ${home.area}
${emoji.generateDate()} ${home.deadline}
${emoji.generateZap()} ${home.notes}
        
`;
    });
    await ctx.reply(replyMsg);
    return ctx.reply('Подписаться на обновление?',
        Markup.inlineKeyboard([
            Markup.button.callback('Подписаться', 'Follow')
        ]));
    }
});

bot.action('Follow', async (ctx, next) => {
    const id = ctx.update.callback_query.from.id;
    await changeState(id, 'FOLLOWED');
    const user = await (await getUserById(id)).pop();
    logger.info(`User [${id}] followed on updates. Searching city is ${user.city}]`);
    return ctx.reply('👍').then(() => next());
});

bot.launch(configs);