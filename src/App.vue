<template>
  <ResizeView>
    <template #top>
      <Operation />
    </template>
    <template #left>
      <ListData />
    </template>
    <template #right>
      <Editor></Editor>
    </template>
  </ResizeView>
</template>
<script setup>
import ResizeView from "./components/ResizeView.vue";
import Operation from "./components/Operation.vue";
import ListData from "./components/ListData.vue";
import Editor from "./components/Editor.vue";
</script>

<style scoped></style>
