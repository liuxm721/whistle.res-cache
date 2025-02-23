
module.exports = (ctx) => {
  const fileList = ctx.storage.getFileList();
  for (const file of fileList) {
    file.data = JSON.parse(file.data)
  }
  ctx.body = fileList
};
