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
        // 如果当前没有选中文件，默认选中第一个
        if (!file.value && fileList.length > 0) {
          file.value = fileList[0];
        }
      })
      .catch((err) => {
        console.log(err);
        fileList.length = 0;
      });
  }

  function setFile(_file) {
    if (!_file) {
      file.value = fileList.length > 0 ? fileList[0] : null;
      return;
    }

    const targetFile = fileList.find((item) => item.name === _file.name);
    file.value = targetFile || (fileList.length > 0 ? fileList[0] : null);
  }

  async function clearFile() {
    return apis.clearFile().then(() => {
      file.value = null;
      fileList.length = 0;
    });
  }

  async function updateFile(data) {
    return apis
      .updateFile({
        name: data.name,
        data: data.data,
      })
      .finally(() => {
        setFileList();
      });
  }

  async function removeFile(data) {
    return apis
      .removeFile({
        name: data.name,
      })
      .then(() => {
        // 如果删除的是当前选中的文件，需要重置当前文件
        if (file.value?.name === data.name) {
          file.value = null;
        }
      })
      .finally(() => {
        setFileList();
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
