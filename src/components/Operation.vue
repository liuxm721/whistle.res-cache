<template>
  <button @click="onClear">清除缓存</button>
  <button @click="onSave">保存</button>
  <button @click="onRemove">删除</button>
</template>

<script setup>
import { useFile } from "../hooks/file";
import { useEditor } from "../hooks/editor";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

const { clearFile, updateFile, removeFile, file, setFileList, setFile } =
  useFile();
const { getValue, clearEditor, addEventListener } = useEditor();

function onClear() {
  clearFile().then(() => {
    clearEditor();
  });
}

function shortcutKeySave(event) {
  if (event.ctrlKey && event.keyCode === monaco.KeyCode.KeyS) {
    event.preventDefault();
    onSave();
  }
}

addEventListener("onKeyDown", shortcutKeySave);

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
    });
}

function onRemove() {
  removeFile({
    name: file.value.name,
  });
}
</script>

<style lang="scss"></style>
