module.exports = (ctx) => {
  let files = ctx.request.body;

  // 参数归一化
  if (!Array.isArray(ctx.request.body)) {
    files = [files];
  }

  for (const file of files) {
    ctx.storage.updateFile(file.name, JSON.stringify(file.data));
  }
  ctx.body = {
    code: 0,
    message: "success",
  };
};
