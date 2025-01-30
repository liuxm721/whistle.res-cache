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

function handleMouseDown(e) {
  e.preventDefault();

  const handleMouseMove = (e) => {
    const leftWidth = e.clientX;
    document.querySelector(
      ".resize-bottom--left"
    ).style.width = `${leftWidth}px`;
    // 触发 resize 事件
    window.dispatchEvent(new Event("resize"));
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}
</script>

<style lang="scss" scoped>
.resize-container {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .resize-top {
    // height: 30px;
  }
  .resize-bottom {
    display: flex;
    flex: 1 1 auto;
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
    cursor: col-resize;
    background-color: var(--vscode-sidebar-border);
  }
}
</style>
