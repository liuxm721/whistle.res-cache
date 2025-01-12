import { reactive, ref } from "vue";
import apis from "../api";

const fileList = reactive([]);
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
      })
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
    return apis.clearFile();
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
