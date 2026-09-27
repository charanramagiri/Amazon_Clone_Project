import { qs, setHTML } from './utils/dom.js';

export function renderView(selector, template) {
  const container = qs(selector);

  if (!container) {
    return;
  }

  setHTML(container, template());
}

export function renderString(selector, html) {
  const container = qs(selector);

  if (!container) {
    return;
  }

  setHTML(container, html);
}
