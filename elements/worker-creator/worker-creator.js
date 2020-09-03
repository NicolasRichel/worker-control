/**
 * Worker Creator Element
 *
 * This element is used to create workers by clicking a button.
 * The script that define the workers created by this element must be specified
 * by the 'src' attribute (if its not, the button will be automatically disabled).
 */

export default class WorkerCreator extends HTMLElement {

  constructor() {
    super();
    this.count = 0;
    this._createShadowDOM();
    this.addEventListener('click', this.createWorker);
  }

  _createShadowDOM() {
    const btn = document.createElement('button');
    btn.textContent = this.textContent;
    this.attachShadow({ mode: 'open' }).appendChild(btn);
  }

  connectedCallback() {
    this.disabled = this.hasAttribute('disabled');
    if (!window.Worker) {
      console.warn('Web Workers not supported -> Worker Creator disabled.');
      this.disabled = true;
    }
    if (!this.hasAttribute('src')) {
      console.warn('Worker Creator must have a \'src\' attribute -> Worker Creator disabled.');
      this.disabled = true;
    }
  }

  createWorker(e) {
    const worker = new Worker(this.getAttribute('src'));
    this.count++;
    const event = new CustomEvent('worker-created', {
      detail: {
        id: generateUUIDv4(),
        name: `${this.hasAttribute('name') ? this.getAttribute('name') : 'Worker'}-${this.count}`,
        worker: worker
      }
    });
    this.dispatchEvent(event);
  }
  


  // Reflect 'disabled' property to attribute
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(value) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
    this.shadowRoot.querySelector('button').disabled = value;
  }

}

window.customElements.define('worker-creator', WorkerCreator);
