'use strict';
const http = require('http');
const pug = require('pug');

const write = (req, res, ...data) => {
  res.write(
    pug.renderFile('./form.pug', {
      path: req.url,
      firstItem: data[0],
      secondItem: data[1],
    })
  );
};

const server = http.createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
    });

    switch (req.method) {
      case 'GET':
        const firstItems = {
          yakiniku: '焼き肉',
          rice: 'ごはん',
          sushi: '寿司',
        };
        const secondItems = {
          shabu: 'しゃぶしゃぶ',
          bread: 'パン',
          pizza: 'ピザ',
        };
        if (req.url === '/enquetes/yaki-shabu') {
          write(req, res, firstItems.yakiniku, secondItems.shabu);
        } else if (req.url === '/enquetes/rice-bread') {
          write(req, res, firstItems.rice, secondItems.bread);
        } else if (req.url === '/enquetes/sushi-pizza') {
          write(req, res, firstItems.sushi, secondItems.pizza);
        }
        res.end();
        break;
      case 'POST':
        let rawData = '';

        req.on('data', chunk => {
          rawData = rawData + chunk;
        }).on('end', () => {
          const answer = new URLSearchParams(rawData);
          const body = `${answer.get('name')}さんは${answer.get('favorite')}に投票しました`;
          const html = `<!DOCTYPE html>
            <html lang="ja">
            <body><h1>${body}</h1></body>
            </html>`;
          console.info(`[${now}] ${body}`);
          res.write(html);
          res.end();
        });
        break;
      default:
        break;
    }
  }).on('error', e => {
    console.error(`[${new Date()}] Server Error`, e);
  }).on('clientError', e => {
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = 8000;

server.listen(port, () => {
  console.info(`[${new Date()}] Listening on port:${port}`);
});
