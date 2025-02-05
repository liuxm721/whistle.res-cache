import { ref } from "vue";
import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

// Worker 配置
const workerMap = {
  json: jsonWorker,
  css: cssWorker,
  scss: cssWorker,
  less: cssWorker,
  html: htmlWorker,
  handlebars: htmlWorker,
  razor: htmlWorker,
  typescript: tsWorker,
  javascript: tsWorker,
};

// 配置 Monaco 环境
self.MonacoEnvironment = {
  getWorker(_, label) {
    return new (workerMap[label] || editorWorker)();
  },
};

let editor;
const fileType = ref("");

// 语言列表
const languages = monaco.languages.getLanguages().map((lang) => lang.id);
const commonLanguages = [
  "json",
  "html",
  "css",
  "javascript",
];
const otherLanguages = languages.filter(
  (lang) => !commonLanguages.includes(lang) && !lang.includes("freemarker2")
);

// 事件监听
const onEvent = {};

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
    const [, fileType] = contentType.split(";")[0].split("/");

    if (fileType) {
      setLanguage(fileType);
    }

    editor.setValue(data);
    editor.updateOptions({ readOnly: !data });
    return data;
  }

  function clearEditor() {
    editor.setValue("");
    editor.updateOptions({ readOnly: true });
  }

  function getValue() {
    return editor.getValue() || "";
  }

  function addEventListener(event, cb) {
    if (!Array.isArray(onEvent[event])) {
      onEvent[event] = [];
    }
    onEvent[event].push(cb);
  }

  function setLanguage(language) {
    monaco.editor.setModelLanguage(editor.getModel(), language);
    fileType.value = language;
  }

  return {
    createEditor,
    updateEditor,
    getValue,
    addEventListener,
    clearEditor,
    setLanguage,
    fileType,
    commonLanguages,
    otherLanguages,
  };
}
