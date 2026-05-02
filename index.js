"use strict";
const http = require("node:http");
const pug = require("pug");

const surveys = {
  "/enquetes/yaki-tofu": {
    firstItem: "焼き肉",
    secondItem: "湯豆腐",
  },
  "/enquetes/sushi-pizza": {
    firstItem: "寿司",
    secondItem: "ピザ",
  },
};

function renderPage(template, locals = {}) {
  return pug.renderFile(template, locals);
}

const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);

    switch (req.method) {
      case "GET":
        if (req.url === "/") {
          res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
          });
          res.write(renderPage("./home.pug"));
        } else if (surveys[req.url]) {
          res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
          });
          res.write(
            renderPage("./form.pug", {
              path: req.url,
              ...surveys[req.url],
            }),
          );
        } else {
          res.writeHead(404, {
            "Content-Type": "text/html; charset=utf-8",
          });
          res.write("<!DOCTYPE html><html lang=\"ja\"><body><h1>Not Found</h1></body></html>");
        }
        res.end();
        break;
      case "POST":
        if (!surveys[req.url]) {
          res.writeHead(404, {
            "Content-Type": "text/html; charset=utf-8",
          });
          res.end("<!DOCTYPE html><html lang=\"ja\"><body><h1>Not Found</h1></body></html>");
          break;
        }

        let rawData = "";
        req
          .on("data", (chunk) => {
            rawData += chunk;
          })
          .on("end", () => {
            const answer = new URLSearchParams(rawData);
            const body = `${answer.get("name")}さんは${answer.get("favorite")}に投票しました`;
            console.info(`[${now}] ${body}`);
            res.writeHead(200, {
              "Content-Type": "text/html; charset=utf-8",
            });
            res.write(
              `<!DOCTYPE html><html lang="ja"><body><h1>${body}</h1></body></html>`,
            );
            res.end();
          });
        break;
      default:
        res.writeHead(405, {
          "Content-Type": "text/html; charset=utf-8",
        });
        res.end(
          "<!DOCTYPE html><html lang=\"ja\"><body><h1>Method Not Allowed</h1></body></html>",
        );
        break;
    }
  })
  .on("error", (e) => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on("clientError", (e) => {
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = Number(process.env.PORT) || 8100;
server.listen(port, () => {
  console.info(`[${new Date()}] Listening on ${port}`);
});
