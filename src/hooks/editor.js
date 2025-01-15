import { ref } from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/monaco.contribution";
import "monaco-editor/esm/vs/language/json/monaco.contribution";
import "monaco-editor/esm/vs/language/css/monaco.contribution";
import 'monaco-editor/esm/vs/editor/editor.all.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js';
// import "monaco-editor/esm/vs/language/html/monaco.contribution";

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
      wordWrap: 'on',
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
    editor.getModel().setLanguage(lang);
    console.log('uri', editor.getModel().uri);

    // 格式化json
    if (lang === "json") {
      data = JSON.stringify(JSON.parse(data), null, 2);
    }

    curData = data;
    editor.setValue(data);
  }

  function clearEditor() {
    editor.setValue("");
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

  return {
    createEditor,
    updateEditor,
    getValue,
    addEventListener,
    isChange,
    clearEditor,
  };
}
