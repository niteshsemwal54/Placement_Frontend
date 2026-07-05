export function showToast(message) {
  window.dispatchEvent(new CustomEvent("app:toast", { detail: { message } }));
}
