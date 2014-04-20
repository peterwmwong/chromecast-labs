export default class ElementInterface {
  constructor(el){ this.el = el; }

  qs(selector) { return this.el.shadowRoot.querySelector(selector); }
  qsa(selector){ return this.el.shadowRoot.querySelectorAll(selector); }
}
