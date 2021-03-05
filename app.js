'use strict';

const yargs = require('yargs').argv;
const { log4js } = require('./utils/log4js');
const logger = log4js.getLogger('bot');
const { startLoop, findHome } = require('./models/homes');
const { getUsers, getUserById, createUser, changeState, insertCity } = require('./models/users');
const Emoji = require('./models/emoji');
const emoji = new Emoji();
const { Telegraf } = require('telegraf');
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
    if (!isNaN(city)) {
        return ctx.reply(`Не верно введен город`);
    }
    logger.info(`User [${user.id}] added city name ${city}`);
    await changeState(user.id, 'RUN');
    await insertCity(user.id, city);
    const result = await findHome(city);
    if (result.length === 0) {
        return ctx.reply(`Нет квартир в г.${city}`);
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
    return ctx.reply(replyMsg);
    }
});

bot.launch(configs);