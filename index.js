'use strict';
const http = require('http');
const pug = require('pug');
/**
 * アンケートの表示アイテムを変更する
 * @param {String} enURL アンケートURL
 * @param {Object} res HTTPレスポンス
 * @param {String} first アンケート内容1
 * @param {String} second アンケート内容2
 */
function enquetesChange(enURL, res, first, second){  
  res.write(pug.renderFile('./form.pug', {
    path: enURL,
    firstItem: first,
    secondItem: second
  }))  
}

const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info('[' + now + '] Requested by ' + req.socket.remoteAddress);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        const yaki_shabu = '/enquetes/yaki-shabu';
        const rice_bread = '/enquetes/rice-bread';
        const sushi_pizza = '/enquetes/sushi-pizza';

        switch(req.url){
          case yaki_shabu:
            enquetesChange(yaki_shabu, res, '焼肉', 'しゃぶしゃぶ');
            break;
          case rice_bread:
            enquetesChange(rice_bread, res, 'ごはん', 'パン');
            break;
          case sushi_pizza:
            enquetesChange(sushi_pizza, res, '寿司', 'ピザ');
          default:
            break;
        }                 
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData = rawData + chunk;
          })
          .on('end', () => {
            const qs = require('querystring');
            const answer = qs.parse(rawData);
            const body = answer['name'] + 'さんは' +
              answer['favorite'] + 'に投票しました';
            console.info('[' + now + '] ' + body);
            res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
              body + '</h1></body></html>');
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error('[' + new Date() + '] Server Error', e);
  })
  .on('clientError', e => {
    console.error('[' + new Date() + '] Client Error', e);
  });
const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});
