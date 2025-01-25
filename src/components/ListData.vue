<template>
  <div class="list-data">
    <div
      class="list-item"
      :class="{
        'list-item--active': item.name === file?.name,
        'list-item--isChange': item.name === file?.name && isChange,
      }"
      v-for="(item, index) in fileList"
      :key="index"
      @click="onClickRecord(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useFile } from "../hooks/file";
import { useEditor } from "../hooks/editor";

const { setFileList, fileList, setFile, file } = useFile();
const { isChange } = useEditor();

function onClickRecord(item) {
  setFile(item);
}

// 定时刷新文件列表
function refreshFileList() {
  setFileList().finally(() => {
    // 更新编辑器内容
    setFile(file.value);
    setTimeout(refreshFileList, 1000);
  });
}

refreshFileList();

</script>

<style lang="scss">
.list-data {
  .list-item {
    line-height: 1.5;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      background-color: #dadada;
    }
    &--active,
    &--active:hover {
      background-color: #7cc0f8;
    }
    &--isChange::before {
      content: "*";
      color: red;
    }
  }
}
</style>
