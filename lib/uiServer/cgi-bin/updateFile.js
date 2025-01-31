module.exports = (ctx) => {
  let files = ctx.request.body;

  // 参数归一化
  if (!Array.isArray(ctx.request.body)) {
    files = [files];
  }

  for (const file of files) {
    const { name, data } = file;
    let { statusCode, statusMessage, headers, body } = data || {};
    if (headers["content-type"]?.includes("image")) {
      body = body && body.split(";base64,")[1];
    } else {
      body = body && Buffer.from(body, "utf-8").toString("base64");
    }
    const cacheData = {
      statusCode,
      statusMessage,
      headers,
      base64String: body,
    };
    ctx.storage.updateFile(name, JSON.stringify(cacheData));
  }
  ctx.body = {
    code: 0,
    message: "success",
  };
};
