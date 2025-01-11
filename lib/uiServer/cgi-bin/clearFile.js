
module.exports = (ctx) => {
  const fileList = ctx.storage.getFileList();
  for (const file of fileList) {
    ctx.storage.removeFile(file.name)
  }
  ctx.body = {
    code: 0,
    message: 'success',
    fileList
  };
};
