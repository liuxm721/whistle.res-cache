// For help see https://github.com/ZijianHe/koa-router#api-reference
const getFileList = require("./cgi-bin/getFileList");
const clearFile = require("./cgi-bin/clearFile");
const updateFile = require("./cgi-bin/updateFile");
const removeFile = require("./cgi-bin/removeFile");

module.exports = (router) => {
  router.get("/cgi-bin/get-file-list", getFileList);
  router.post("/cgi-bin/clear-file", clearFile);
  router.post("/cgi-bin/update-file", updateFile);
  router.post("/cgi-bin/remove-file", removeFile);
};
