<template>
  <div id="editor-warp">
    <div id="editor-container"></div>
  </div>
</template>
<script setup>
import { onMounted, watch } from "vue";
import { useEditor } from "../hooks/editor";
import { useFile } from "../hooks/file";

const { createEditor } = useEditor();
const { file } = useFile();

watch(file, (newFile) => {
  // console.log(newFile);
});

onMounted(() => {
  const editor = createEditor(document.getElementById("editor-container"));
  const editorWarp = document.getElementById("editor-warp");
  let timer = null;
  window.addEventListener("resize", () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      editor.layout({
        width: editorWarp.clientWidth,
        height: editorWarp.clientHeight,
      });
    }, 300);
  });
});
</script>

<style lang="scss">
#editor-warp {
  position: relative;
  width: 100%;
  height: 100%;

  #editor-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
