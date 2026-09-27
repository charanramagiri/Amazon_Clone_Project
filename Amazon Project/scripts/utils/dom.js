export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function setHTML(element, html) {
  if (!element) {
    return;
  }

  element.innerHTML = html;
}

export function bindAll(selector, handler, root = document) {
  qsa(selector, root).forEach((element) => {
    element.addEventListener('click', handler);
  });
}

export function createTextNode(text) {
  return document.createTextNode(String(text));
}
