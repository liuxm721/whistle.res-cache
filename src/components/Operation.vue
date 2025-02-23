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
      <select
        class="vscode-dropdown"
        :value="fileType"
        @change="onLanguageChange"
      >
        <optgroup label="常用">
          <option v-for="language in commonLanguages" :key="language">
            {{ language }}
          </option>
        </optgroup>
        <optgroup label="其他">
          <option v-for="language in otherLanguages" :key="language">
            {{ language }}
          </option>
        </optgroup>
      </select>
    </div>
  </div>
</template>

<script setup>
import { useFile } from "../hooks/file";
import { useEditor } from "../hooks/editor";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

const { clearFile, updateFile, removeFile, file, setFile, fileList } =
  useFile();
const {
  clearEditor,
  addEventListener,
  setLanguage,
  fileType,
  commonLanguages,
  otherLanguages,
} = useEditor();

function onClear() {
  clearFile().then(() => {
    clearEditor();
  });
}

function shortcutKeySave(event) {
  // Ctrl + S
  // monaco.KeyCode.KeyS 编辑器内部的键盘码
  // e.key window.keydown事件的键值
  if (
    event.ctrlKey &&
    (event.keyCode === monaco.KeyCode.KeyS || ["S", "s"].includes(event.key))
  ) {
    event.preventDefault();
    onSave();
  }
}

addEventListener("onKeyDown", shortcutKeySave);
window.addEventListener("keydown", shortcutKeySave);

function onSave() {
  const files = fileList.filter((file) => file.isChange);
  updateFile(
    files.map((file) => ({
      name: file.name,
      data: {
        ...file.data,
        res: {
          ...file.data.res,
          body: file.editedContent,
        },
      },
    }))
  ).then(() => {
    for (const file of fileList) {
      file.isChange = false;
      file.editedContent = null;
    }
  });
}

function onRemove() {
  removeFile({
    name: file.value.name,
  });
}

function onLanguageChange(event) {
  const selectedLanguage = event.target.value;
  setLanguage(selectedLanguage);
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

.vscode-dropdown {
  max-height: 200px;
  overflow-y: auto;
}

.vscode-dropdown::-webkit-scrollbar {
  width: 8px;
}

.vscode-dropdown::-webkit-scrollbar-thumb {
  background-color: var(--vscode-scrollbarSlider-background);
  border-radius: 4px;
}

.vscode-dropdown::-webkit-scrollbar-thumb:hover {
  background-color: var(--vscode-scrollbarSlider-hoverBackground);
}

.vscode-dropdown::-webkit-scrollbar-thumb:active {
  background-color: var(--vscode-scrollbarSlider-activeBackground);
}
</style>
