<template>
  <div class="resize-container">
    <div class="resize-top"><slot name="top"></slot></div>
    <div class="resize-bottom">
      <div class="resize-bottom--left">
        <slot name="left"></slot>
        <div class="w-divider" @mousedown="handleMouseDown"></div>
      </div>
      <div class="resize-bottom--right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isDragging = ref(false);

const handleMouseDown = (e) => {
  isDragging.value = true;
};

function handleMouseMove(e) {
  if (isDragging.value) {
    const leftWidth = e.clientX;
    document.querySelector(
      ".resize-container--left"
    ).style.width = `${leftWidth}px`;
  }
}

function handleMouseUp() {
  isDragging.value = false;
}

window.addEventListener("mousemove", handleMouseMove);

window.addEventListener("mouseup", handleMouseUp);
</script>

<style lang="scss" scoped>
.resize-container {
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
  height: 100vh;

  
  
  .resize-top {
    height: 30px;
    background-color: #f0f0f0;
  }
  .resize-bottom {
    display: flex;
    flex: 1 1 auto;
    background-color: #f0f0f0;
  }
  .resize-bottom--left {
    flex: 0 0 auto;
    width: 300px;
    min-width: 10%;
    max-width: 50%;
    position: relative;
    overflow: hidden auto;
  }
  .resize-bottom--right {
    flex: 1 1 auto;
  }

  .w-divider {
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 100%;
    cursor: ew-resize;
    border-right: 1px solid #fff;
  }
}
</style>
