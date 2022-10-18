'use strict';
const http = require('http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        let firstItem;
        let secondItem;
        // req.urlのswitch
        switch(req.url) {
          case '/enquetes/yaki-shabu':
            firstItem = '焼き肉';
            secondItem = 'しゃぶしゃぶ';
            break;
          case '/enquetes/rice-bread':
            firstItem = 'ごはん';
            secondItem = 'パン';
            break;
          case '/enquetes/sushi-pizza':
            firstItem = '寿司';
            secondItem = 'ピザ';
            break;
          case '/enquetes/tsuna-kombu':
            firstItem = 'ツナマヨおにぎり';
            secondItem = '昆布おにぎり';
            break;
          case '/enquetes/cocoa-coffee':
            firstItem = 'ココア';
            secondItem = 'コーヒー';
            break;
          case '/enquetes/soba-udon':
            firstItem = 'そば';
            secondItem = 'うどん';
            break;
          case '/enquetes/tkg-natto':
            firstItem = '卵かけごはん';
            secondItem = '納豆ごはん';
            break;
          case '/enquetes/egg-daikon':
            firstItem = 'おでんの卵';
            secondItem = 'おでんの大根';
            break;
          
          default:
            break;
        }
        // req.urlのswitch終わり
        res.write(pug.renderFile('form.pug', {
          path: req.url,
          firstItem,
          secondItem
        }));
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData += chunk;
          })
          .on('end', () => {
            const answer = new URLSearchParams(rawData);
            const body = `${answer.get('name')}さんは${answer.get('favorite')}に投票しました`;
            console.info(`[${now}] ${body}`);
            res.write(`<!DOCTYPE html><html lang="ja"><body><h1>${body}</h1></body></html>`);
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on('clientError', e => {
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = 8000;
server.listen(port, () => {
  console.info(`[${new Date()}] Listening on ${port}`);
});
