'use strict';

const enquetes = {
  'yaki-tofu': {
    firstItem: '焼き肉',
    secondItem: '湯豆腐'
  },
  'rice-bread': {
    firstItem: 'ごはん',
    secondItem: 'パン'
  },
  'sushi-pizza': {
    firstItem: '寿司',
    secondItem: 'ピザ'
  }
};

const http = require('node:http');
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
        const request = req.url.split('/').slice(-1)[0];
        const enquete = enquetes[request];
        if (typeof enquete != 'undefined') {
          res.write(
            pug.renderFile('./form.pug', Object.assign({path: req.url}, enquete))
          );
        } else {
          console.info(`[${now}]無効なURL${request}`)
        };
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
            res.write(
              `<!DOCTYPE html><html lang="ja"><body><h1>${body}</h1></body></html>`
            );
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
