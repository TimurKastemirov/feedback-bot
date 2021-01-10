const fs = require('fs');
const { Telegraf } = require('telegraf');
const { botToken } = require('./bot-token');
const { messages: { helloMessage, thanksMessage } } = require('./messages');
const { subscriberChatIds: savedSubscriberChatIds } = require('./subscriber-chat-ids');

if (botToken === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

(function (bot) {
    let subscriberChatIds = savedSubscriberChatIds.slice(0);

    bot.start(
        (ctx) => {
            return ctx.reply(helloMessage);
        }
    ); //ответ бота на команду /start

    bot.help((ctx) => {
        return ctx.reply('Оставьте свой анонимный отзыв об Исмаиловой Эрисмаль Мусаевне');
    }); //ответ бота на команду /help

    bot.command('subscribe', (ctx) => {
        const chatId = ctx.update.message.chat.id;
        if (subscriberChatIds.indexOf(chatId) === -1) {
            subscriberChatIds.push(chatId);
        }

        const textToWrite = `exports.subscriberChatIds = [\n\t${subscriberChatIds.join(",\n\t")}\n];`
        fs.writeFile('./subscriber-chat-ids.js', textToWrite, () => {});

        return ctx.reply('вы подписаны на получение анонимных отзывов');
    });

    bot.command('unsubscribe', (ctx) => {
        const chatId = ctx.update.message.chat.id;
        subscriberChatIds = subscriberChatIds.filter(id => id !== chatId);

        const textToWrite = `exports.subscriberChatIds = [\n\t${subscriberChatIds.join(",\n\t")}\n];`
        fs.writeFile('./subscriber-chat-ids.js', textToWrite, () => {});

        return ctx.reply('вы отписаны от получения анонимных отзывов');
    });

    bot.on('text', ctx => {
        const messageText = ctx.update.message.text;
        if (subscriberChatIds.length > 0) {
            subscriberChatIds.forEach(chatId => {
                bot.telegram.sendMessage(chatId, messageText);
            });
        }

        return ctx.reply(thanksMessage);
    });

    bot.launch(); // запуск бота

}(new Telegraf(botToken)));

