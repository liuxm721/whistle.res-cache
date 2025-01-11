const url = require("url");

module.exports = (server, options) => {
  // handle http request
  const { storage } = options;
  server.on("request", async (req, res) => {
    const urlInfo = url.parse(req.originalReq.url, true);
    const fileName = urlInfo.host + urlInfo.pathname;
    const ruleValue = getRuleValue(req);

    // const b = storage.getFileList();
    req.passThrough(
      (rawBuffer, next, ctx) => {
        ctx.getJson((err, json) => {
          // console.log("body ===>>", json);
          if (storage.existsFile(fileName)) {
            const readFile = storage.readFile(fileName);
            const { statusCode, statusMessage, headers, base64String, time } =
              JSON.parse(readFile);
            if (
              ruleValue.time > 0 &&
              time + ruleValue.time * 1000 < new Date().getTime()
            ) {
              console.log("删除过期文件");
              storage.removeFile(fileName);
            } else {
              headers['from-res-cache'] = 'true';
              delete headers['content-encoding'];
              delete headers['content-length'];
              res.writeHead(statusCode, statusMessage, headers);
              console.log("返回缓存文件");
              // base64String && console.log('base64String', Buffer.from(base64String, 'base64').toString('utf-8'))
              res.end(Buffer.from(base64String, 'base64'));
            }
          }
          next({ body: rawBuffer });
        });
      },
      (rawBuffer, next, ctx) => {
        // 缓存不存在，则写入缓存
        if (!storage.existsFile(fileName)) {
          ctx.getBuffer((err, buff) => {
            console.log("getBuffer ===>>", buff.toString('base64'));
            const { statusCode, statusMessage, rawHeaders} = ctx
            const headers = {}
            for (let i = 0; i < rawHeaders.length; i += 2) {
              headers[rawHeaders[i].toLocaleLowerCase()] = rawHeaders[i + 1];
            }
            const file = {
              statusCode: statusCode,
              statusMessage: statusMessage,
              headers,
              base64String: buff?.toString('base64'),
              time: new Date().getTime(),
            };
            const writeFile = storage.writeFile(fileName, JSON.stringify(file));
  
            console.log(writeFile ? "写入成功" : "写入失败");
          })
        }
        next({ body: rawBuffer });
      }
    );
  });
};

function getRuleValue(req) {
  // time=5;hash=body
  const oReq = req.originalReq;
  return oReq.ruleValue.split(";").reduce((acc, cur) => {
    const [key, value] = cur.split("=");
    acc[key] = value;
    return acc;
  }, {});
}
