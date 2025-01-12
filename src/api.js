const ROOT_URL = "http://127.0.0.1:8899/plugin.res-cache/";

const PATH_MAP = {
  getFileList: "cgi-bin/get-file-list",
  clearFile: "cgi-bin/clear-file",
  updateFile: "cgi-bin/update-file",
  removeFile: "cgi-bin/remove-file",
};

const apis = {
  getFileList: () =>
    fetch(ROOT_URL + PATH_MAP.getFileList, { method: "get" }).then((res) =>
      res.json()
    ),
  clearFile: () =>
    fetch(ROOT_URL + PATH_MAP.clearFile, { method: "post" }).then((res) =>
      res.json()
    ),
  updateFile: (data) =>
    fetch(ROOT_URL + PATH_MAP.updateFile, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  removeFile: (data) =>
    fetch(ROOT_URL + PATH_MAP.removeFile, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};

export default apis;
