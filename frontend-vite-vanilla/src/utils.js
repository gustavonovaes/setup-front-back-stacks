export function onReady(fn) {
  if (document.readyState === "complete") {
    fn();
  } else {
    window.addEventListener("DOMContentLoaded", fn);
  }
}
