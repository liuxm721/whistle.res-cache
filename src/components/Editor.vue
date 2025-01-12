<template>
  <div id="edit-container"></div>
</template>
<script setup>
import { onMounted } from "vue";
import { useEditor } from "../hooks/editor";

const { createEditor } = useEditor();

onMounted(() => {
  createEditor(document.getElementById("edit-container"));
});
</script>

<style>
#edit-container {
  width: 100%;
  height: 100%;
}
</style>
