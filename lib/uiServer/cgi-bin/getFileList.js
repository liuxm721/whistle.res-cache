
module.exports = (ctx) => {
  const fileList = ctx.storage.getFileList();
  for (const file of fileList) {
    const { statusCode, statusMessage, headers, base64String, } = JSON.parse(file.data);
    let body = null
    if (headers['content-type']?.includes('image')) {
      body = `data:${headers['content-type']};base64,${base64String}`
    } else {
      body = base64String && Buffer.from(base64String, 'base64').toString('utf-8')
    }
    file.data = {
      statusCode,
      statusMessage,
      headers,
      body,
    }
  }
  ctx.body = fileList
};
