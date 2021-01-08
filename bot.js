const { Telegraf } = require('telegraf');
const { botToken } = require('./bot-token');

if (botToken === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

(function (bot) {
    let subscriberChatIds = [];

    bot.start(
        (ctx) => {
            const text = `Здравствуйте,вас приветствует бот отзывов.\nВы можете оставить анонимный отзыв об Исмаиловой Эрисмаль Мусаевне как о человеке и специалисте`;
            return ctx.reply(text);
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
        return ctx.reply('вы подписаны на получение анонимных отзывов');
    });

    bot.command('unsubscribe', (ctx) => {
        const chatId = ctx.update.message.chat.id;
        subscriberChatIds = subscriberChatIds.filter(id => id !== chatId);
        return ctx.reply('вы отписаны от получения анонимных отзывов');
    });

    bot.on('text', ctx => {
        const messageText = ctx.update.message.text;
        if (subscriberChatIds.length > 0) {
            subscriberChatIds.forEach(chatId => {
                bot.telegram.sendMessage(chatId, messageText);
            });
        }
    });

    bot.launch(); // запуск бота

}(new Telegraf(botToken)));

