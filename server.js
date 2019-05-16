const express = require('express');
const app = express();

const bodyparser = require('body-parser');
app.use(bodyparser.json());

const https = require('https');

// jsdom is used to fetch from the sites html
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function sendMessage(chat_id, text) {
  const telegram_send_req = https.request({
    method: 'POST',
    host: 'api.telegram.org',
    path: '/bot/' + process.env.TELEGRAM_TOKEN + 'sendMessage?chat_id=' + chat_id + "&text=" + encodeURIComponent(pray)
  }, (res) => {
    console.log(`Sent "${text}" to id:${chat_id}`);
  });
  telegram_send_req.end();
}

app.post('/telegram', (req, res) => {
  const chatId = req.body.message.chat.id;
  const textReceived = req.body.message.text;
  const churchEmoji = '⛪';
  const prayEmoji = '🙏'

  const sendPray = https.request({
    method: 'POST',
    host: 'vaticanoweb.com',
    path: '/preghiere/preghiera_del_giorno.asp'
  }, (res) => {
    let body = '';

    if (res.statusCode == 200) {
      res.on('data', function (d) {
        body += d;
      });

      res.on('end', function () {
        // scraping of the site's content
        const dom = new JSDOM(data);
        const pray = dom.window.document.querySelector('.entry-content div p').textContent.trim();
        sendMessage(chatId, `${churchEmoji} ${prayEmoji} \n\n ${pray} \n\n ${churchEmoji} ${prayEmoji}`);
      });
    }
  });


  if (textReceived.indexOf('amen') == -1) {
    sendMessage(chatId, 'Non saprei cosa risponderti, ma se ci fosse un amen...');
  } else {
    sendPray.end();
  }

  res.end();
});

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
