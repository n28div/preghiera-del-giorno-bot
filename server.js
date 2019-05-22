const express = require('express');
const app = express();

const bodyparser = require('body-parser');
app.use(bodyparser.json());

const https = require('https');

// jsdom is used to fetch from the sites html
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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
  
  const sendPray = https.request({
    method: 'POST',
    host: 'vaticannews.va',
    path: '/it/vangelo-del-giorno-e-parola-del-giorno.html'
  }, (res) => {
    let body = '';

    if (res.statusCode == 200) {
      res.on('data', function (d) {
        body += d;
      });

      res.on('end', function () {
        // scraping of the site's content
        const dom = new JSDOM(body);
        const pray = dom.window.document.querySelector('section.section:nth-child(6) > div:nth-child(2) > div:nth-child(1) > p:nth-child(1)').textContent.trim();
        sendMessage(chatId, `${churchEmoji} ${prayEmoji} \n\n ${pray} \n\n ${churchEmoji} ${prayEmoji}`);
      });
    }
  });


  if (textReceived.indexOf('amen') == -1) {
    sendMessage(chatId, `Caro ${username}..... non saprei cosa risponderti ${sadEmoji}........ ma se nel tuo messaggio ci fosse stato un amen.... ${winkEmoji}${winkEmoji}${winkEmoji}`);
  } else {
    sendPray.end();
  }

  res.end();
});

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
