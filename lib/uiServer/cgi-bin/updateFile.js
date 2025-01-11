module.exports = (ctx) => {
  const { name, data } = ctx.request.body;
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
  console.log("data.body", cacheData);
  ctx.storage.updateFile(name, JSON.stringify(cacheData));
  ctx.body = {
    code: 0,
    message: "success",
  };
};
