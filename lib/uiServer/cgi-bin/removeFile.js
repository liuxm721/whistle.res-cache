module.exports = (ctx) => {
  const { name } = ctx.request.body;
  ctx.storage.removeFile(name);
  ctx.body = {
    code: 0,
    message: "success",
  };
};
