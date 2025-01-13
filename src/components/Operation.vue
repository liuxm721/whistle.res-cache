<template>
  <button @click="onClear">清除缓存</button>
  <button @click="onSave">保存</button>
  <button @click="onRemove">删除</button>
</template>

<script setup>
import { useFile } from "../hooks/file";
import { useEditor } from "../hooks/editor";

const { clearFile, updateFile, removeFile, file, setFileList, setFile } =
  useFile();
const { getValue, updateEditor, clearEditor } = useEditor();

function onClear() {
  clearFile().then(() => {
    clearEditor();
  });
}

function onSave() {
  updateFile({
    name: file.value.name,
    data: {
      ...file.value.data,
      body: getValue(),
    },
  })
    .then(setFileList)
    .then(() => {
      setFile(file.value);
      const { body, headers } = file.value.data;
      updateEditor(body, { headers });
    });
}

function onRemove() {
  removeFile({
    name: file.value.name,
  });
}
</script>

<style lang="scss"></style>
