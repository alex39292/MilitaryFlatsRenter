'use strict';

const yargs = require('yargs').argv;
const { log4js } = require('./utils/log4js');
const logger = log4js.getLogger('bot');
const { startLoop, findHome } = require('./models/homes');
const { getUsers, getUserById, createUser, changeState, insertCity } = require('./models/users');
const { generateSticker } = require('./models/stickers');
const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf(yargs.token);

startLoop();

bot.start(async ctx => {
    const user = ctx.message.from;
    logger.info(`User [${user.id}] started bot`);
    await createUser(user.id, user.username);
    ctx.reply('Введите населенный пункт для поиска');
});

bot.on('message', async ctx => {
    const user = ctx.message.from;
    const city = ctx.message.text;
    logger.info(`User [${user.id}] added city name ${city}`);
    await changeState(user.id, 'RUN');
    await insertCity(user.id, city);
    const result = await findHome(city);
    if (result.length === 0) {
        ctx.reply(`Нет квартир в г.${city}`);
    } else {
        let count = 0;
        let replyMsg = '';
        result.forEach(home => {
        replyMsg += `${generateSticker(++count)}. ${home.address.trim()}
        Комнат: ${home.flats}
        Этаж: ${home.floor}
        Площадь: ${home.area}
        Дата: ${home.deadline}
        Примечание: ${home.notes}
        
        `;
    });
    ctx.reply(replyMsg);
    }
});

bot.launch({
    webhook: {
        domain: 'https://91bdbda113e3.ngrok.io',
        port: 5000
    }
});