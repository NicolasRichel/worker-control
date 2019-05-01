/**
 * Worker Item Element
 *
 * This element aim at providing an interface to interact with a given worker.
 */


// Element styles
const styles = `
  label {
    font-weight: bold;
  }
`;


// Create element
export default class WorkerItem extends HTMLElement {

  constructor() {
    super();
    this.state = '';
    // Create Shadow DOM
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <style>${styles}</style>
      <div><label>UUID :</label> ${this.getAttribute('uuid')}</div>
      <div><label>Name :</label> ${this.getAttribute('name')}</div>
      <div><label>State :</label> ${this.state}</div>
      <div>
        <button class="btn-stop">Stop</button>
      </div>
    `;
    this.attachShadow({mode: 'open'}).appendChild(wrapper);
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector('.btn-stop')
      .addEventListener('click', this.dispatchStopEvent.bind(this));
    this.state = 'Running';
  }

  // Action Event dispatchers
  dispatchStopEvent(e) {
    this.dispatchEvent(
      new CustomEvent('action', {
        detail: {
          type: 'stop',
          id: this.getAttribute('uuid')
        }
      })
    );
  }
  // ===

}

// Register element
window.customElements.define('worker-item', WorkerItem);
