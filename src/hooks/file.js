import { reactive, ref } from "vue";
import apis from "../api";

// 文件列表
const fileList = reactive([]);

// 当前文件
const file = ref(null);

export function useFile() {
  async function setFileList() {
    return apis
      .getFileList()
      .then((res) => {
        fileList.length = 0;
        fileList.push(...res);
      })
      .catch((err) => {
        console.log(err);
        fileList.length = 0;
      });
  }

  function setFile(_file) {
    const { name } = _file || {};
    const index = fileList.findIndex((item) => item.name === name);
    if (index === -1) {
      file.value = fileList[0];
    } else {
      file.value = fileList[index];
    }
  }

  function clearFile() {
    return apis.clearFile().then(() => {
      file.value = null;
      fileList.length = 0;
    });
  }

  function updateFile(data) {
    return apis.updateFile({
      name: data.name,
      data: data.data,
    });
  }

  function removeFile(data) {
    return apis.removeFile({
      name: data.name,
    });
  }

  return {
    fileList,
    setFileList,
    setFile,
    clearFile,
    file,
    updateFile,
    removeFile,
  };
}
