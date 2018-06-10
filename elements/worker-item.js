/**
 * Worker Item Element
 *
 * This element aim at providing an interface to interact with a given worker.
 */

// Create element
class WorkerItem extends HTMLElement {

  constructor() {
    super();
    this.state = '';
    // Create Shadow DOM
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div><b>UUID :</b> ${this.getAttribute('uuid')}</div>
      <div><b>Name :</b> ${this.getAttribute('name')}</div>
      <div><b>State :</b> ${this.state}</div>
      <div>
        <button class="btn-stop">Stop</button>
      </div>
    `;
    const sdom = this.attachShadow({mode: 'open'});
    sdom.appendChild(wrapper);
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.btn-stop')
      .addEventListener('click', this.dispatchStopEvent.bind(this));
    this.state = 'Running';
  }

  // Action Event dispatchers
  dispatchStopEvent(e) {
    const event = new CustomEvent('action', {
      detail: {
        type: 'stop',
        id: this.getAttribute('uuid'),
      }
    });
    this.dispatchEvent(event);
  }
  // ===

}

// Register element
window.customElements.define('worker-item', WorkerItem);
