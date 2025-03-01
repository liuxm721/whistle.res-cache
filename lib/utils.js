exports.withTryCatch = function withTryCatch(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      console.error("全局捕获异常:", e);
    }
  };
};
