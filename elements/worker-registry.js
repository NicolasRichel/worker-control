/**
 * Worker Registry Element
 *
 * The purpose of the worker registry is to listen to a given worker creator and
 * register every worker it creates.
 * It also manage a list of worker item to interact with workers.
 */

// Create element
class WorkerRegistry extends HTMLElement {

  constructor() {
    super();
    this.registry = new Array();
    // Create Shadow DOM
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <style>
        ul { list-style-type: none; }
        ul > li { margin: 12px;padding: 4px; border: 1px solid black; }
      </style>
      <ul id="toto"></ul>
    `;
    const sdom = this.attachShadow({mode: 'open'});
    sdom.appendChild(wrapper);
  }

  connectedCallback() {
    if (!this.hasAttribute('listen-to')) {
      console.warn('Worker Registry must have a \'listen-to\' attribute.');
    } else {
      const creator = document.getElementById(this.getAttribute('listen-to'));
      if (!creator) {
        console.warn('Worker Registry : \'listen-to\' must point to a valid HTM element.');
      } else if (!(creator instanceof WorkerCreator)) {
        console.warn('Worker Registry : \'listen-to\' must point to a WorkerCreator.');
      } else {
        creator.addEventListener('worker-created', this.addWorkerToRegistry.bind(this));
      }
    }
  }

  // Attribute Change handlers
  static get observedAttributes() { return ['listen-to']; }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'listen-to': this.listenTo_ChangeHandler(oldValue, newValue);
    }
  }

  listenTo_ChangeHandler(oldValue, newValue) {
    if (oldValue && newValue) {
      const newCreator = document.getElementById(newValue);
      if (newCreator instanceof WorkerCreator) {
        // Remove all event listeners from the old worker creator
        const oldCreator = document.getElementById(oldValue);
        oldCreator.parentNode.replaceChild(oldCreator.cloneNode(true), oldCreator);
        // Add event listener to the new worker creator
        newCreator.addEventListener('worker-created', this.addWorkerToRegistry.bind(this));
      } else {
        console.warn('Worker Registry : \'listen-to\' must point to a WorkerCreator.');
      }
    }
  }
  // ===

  // Worker Management functions
  addWorkerToRegistry(e) {
    // Add new worker to registry
    this.registry.push(e.detail);
    // Create new worker item in the shadow DOM
    this.shadowRoot.querySelector('ul').innerHTML += `
      <li id="${e.detail.id}">
        <worker-item uuid="${e.detail.id}" name="${e.detail.name}"></worker-item>
      </li>
    `;
    this.shadowRoot.querySelector(`[uuid="${e.detail.id}"]`)
      .addEventListener('action', this.executeAction.bind(this));
  }

  executeAction(e) {
    switch (e.detail.type) {
      case 'stop': this.removeWorkerFromRegistry(e.detail.id); break;
      default:
    }
  }

  removeWorkerFromRegistry(uuid) {
    const iterator = this.registry.entries();
    let obj, i;
    do {
      obj = iterator.next(); i = obj.value[0];
    } while (uuid !== obj.value[1].id);
    // Remove the worker from registry and stop it
    ( this.registry.splice(i, 1) )[0].worker.terminate();
    // Remove the corresponding worker item
    this.shadowRoot.getElementById(uuid).remove();
  }
  // ===

}

// Register element
window.customElements.define('worker-registry', WorkerRegistry);
