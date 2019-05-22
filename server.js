const express = require('express');
const app = express();

const bodyparser = require('body-parser');
app.use(bodyparser.json());

const https = require('https');

const prays = require('./preghiere.json');

const churchEmoji = '⛪';
const prayEmoji = '🙏';
const sadEmoji = '😔';
const winkEmoji = '😉';

function sendMessage(chatid, text) {
  const requestBody = {
    chat_id: chatid,
    text: text
  }
  
  const telegramSendReq = https.request({
    method: 'POST',
    host: 'api.telegram.org',
    path: `/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    headers: {
      'Content-Type': 'application/json',
    },
  }, (res) => {
    console.log(`Sent ${text} to user id:${chatid}`);
  });
  
  telegramSendReq.write(JSON.stringify(requestBody));
  telegramSendReq.end();
}

app.post('/telegram', (req, res) => {
  const chatId = req.body.message.chat.id;
  const username = req.body.message.chat.username;
  const textReceived = req.body.message.text.toLowerCase();
  
  if (textReceived.indexOf('amen') == -1) {
    sendMessage(chatId, `Caro ${username}..... non saprei cosa risponderti ${sadEmoji}........ ma se nel tuo messaggio ci fosse stato un amen.... ${winkEmoji}${winkEmoji}${winkEmoji}`);
  } else {
    let pray = prays[Math.floor(Math.random()*prays.length)];
    sendMessage(chatId, `${churchEmoji} ${prayEmoji} \n\n ${pray} \n\n ${churchEmoji} ${prayEmoji}`);
  }

  res.end();
});

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
