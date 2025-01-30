import { ref } from "vue";
import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

let editor;
let curData;
const isChange = ref(false);

function setIscChange(event) {
  isChange.value = curData !== this.getValue();
}

// 事件监听
const onEvent = {
  onDidChangeModelContent: [setIscChange],
};

export function useEditor() {
  function createEditor(dom) {
    editor = monaco.editor.create(dom, {
      theme: "vs-dark",
      value: null,
      language: null,
      wordWrap: "on", // 自动换行
      readOnly: true, // 只读
    });

    // 注册事件
    for (const key in onEvent) {
      editor[key]((...event) => {
        onEvent[key].forEach((cb) => {
          cb.call(editor, ...event);
        });
      });
    }

    return editor;
  }

  function updateEditor(data, { headers }) {
    const contentType = headers["content-type"];
    const mimeType = contentType.split(";")[0];
    const lang = mimeType.split("/")[1];
    setLanguage(lang);

    // 格式化json
    if (lang === "json") {
      data = JSON.stringify(JSON.parse(data), null, 2);
    }

    curData = data;
    editor.setValue(data);
    if (data) {
      editor.updateOptions({ readOnly: false });
    }
  }

  function clearEditor() {
    editor.setValue("");
    editor.updateOptions({ readOnly: true });
  }

  function getValue() {
    return editor.getValue();
  }

  function addEventListener(event, cb) {
    if (!Array.isArray(onEvent[event])) {
      onEvent[event] = [];
    }
    onEvent[event].push(cb);
  }

  function setLanguage(language) {
    monaco.editor.setModelLanguage(editor.getModel(), language);
  }

  return {
    createEditor,
    updateEditor,
    getValue,
    addEventListener,
    isChange,
    clearEditor,
    setLanguage,
  };
}
