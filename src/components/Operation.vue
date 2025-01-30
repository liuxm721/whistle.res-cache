<template>
  <div class="operation">
    <div class="operation-left">
      <button class="vscode-button" @click="onClear">
        <i className="bi bi-arrow-counterclockwise"></i>
        清除缓存
      </button>
      <button class="vscode-button" @click="onRemove">
        <i className="bi bi-trash"></i>
        删除
      </button>
      <button class="vscode-button" @click="onSave">
        <i className="bi bi-save"></i>
        保存
      </button>
    </div>
    <div class="operation-right">
      <select class="vscode-dropdown">
        <option>JSON</option>
        <option>XML</option>
        <option>YAML</option>
      </select>
    </div>
  </div>
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

<style lang="scss">
.operation {
  display: flex;
  justify-content: space-between;
  background-color: var(--vscode-sidebar-bg);
  padding: 10px;
  border-bottom: 1px solid var(--vscode-sidebar-border);
}
</style>
