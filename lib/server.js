const url = require("url");

module.exports = (server, options) => {
  // handle http request
  const { storage } = options;
  server.on("request", async (req, res) => {
    const urlInfo = url.parse(req.originalReq.url, true);
    const fileName = urlInfo.host + urlInfo.pathname;
    const ruleValue = getRuleValue(req);

    // 获取抓包数据，不需要等待响应完成
    // req.getReqSession((session) => {
    //   // 如果没有抓包数据，不写入
    //   if (!session) return;

    //   // todo 每个请求不一样
    //   session.query = parseUrlQuery(session.url);
    // });

    function sendCache() {
      if (storage.existsFile(fileName)) {
        const readFile = JSON.parse(storage.readFile(fileName));
        if (
          ruleValue.time > 0 &&
          readFile.endTime + ruleValue.time * 1000 < new Date().getTime()
        ) {
          console.log("删除过期文件");
          storage.removeFile(fileName);
        } else {
          const { statusCode, statusMessage, headers, body } = readFile.res;
          headers["from-res-cache"] = "true";
          delete headers["content-encoding"];
          delete headers["content-length"];
          res.writeHead(statusCode, statusMessage, headers);
          res.end(body);
          console.log("返回缓存");
          return true;
        }
      }
    }

    if (sendCache()) return;

    // 如果没有缓存，继续请求
    req.passThrough();

    // 获取完整的抓包数据，要等待响应完成
    req.getSession((session) => {
      // 如果没有抓包数据，不写入
      if (!session) return;

      // 如果已经有缓存，不再写入
      if (storage.existsFile(fileName)) return;

      session.query = parseUrlQuery(session.url);
      const writeFile = storage.writeFile(fileName, JSON.stringify(session));
      console.log(writeFile ? "写入成功" : "写入失败");
    });
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

// 将 URL 解析逻辑封装为纯函数
function parseUrlQuery(url) {
  const query = url.split("?")[1];
  if (!query) return {};

  const parseQueryValue = (value) => {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded.startsWith("{") || decoded.startsWith("[")) {
        return JSON.parse(decoded);
      }
      return value;
    } catch (e) {
      return value;
    }
  };

  const queryObj = qs.parse(query);
  return Object.keys(queryObj).reduce((acc, key) => {
    acc[key] = parseQueryValue(queryObj[key]);
    return acc;
  }, {});
}
