'use strict';
const http = require('http');
const pug = require('pug');
// アンケートの Map オブジェクト
const enquetes = new Map([
  ['/enquetes/yaki-shabu', ['焼き肉', 'しゃぶしゃぶ']],
  ['/enquetes/rice-bread', ['ごはん', 'パン']],
  ['/enquetes/sushi-pizza', ['寿司', 'ピザ']],
  ['/enquetes/wa-you-chu',['和食', '洋食', '中華']]
]);
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info('[' + now + '] Requested by ' + req.socket.remoteAddress);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        if ( enquetes.get(req.url) ) {     // Map の Key に URL があるとき
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              items: enquetes.get(req.url) // 選択肢の配列をそのまま pug へ
            })
          );
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
