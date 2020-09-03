/**
 * Worker Item Element
 *
 * This element aim at providing an interface to interact with a given worker.
 */

const html = ($this) => `
  <div><label>UUID :</label> ${$this.getAttribute('uuid')}</div>
  <div><label>Name :</label> ${$this.getAttribute('name')}</div>
  <div><label>State :</label> ${$this.statusText}</div>
  <div>
    <button class="btn-stop">Stop</button>
  </div>
`;

const css = `
  label {
    font-weight: bold;
  }
`;

export default class WorkerItem extends HTMLElement {

  constructor() {
    super();
    this.status = 0;
    this.statusText = '';
    this._createShadowDOM();
  }

  _createShadowDOM() {
    const styles = document.createElement('style');
    styles.textContent = css;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html(this);
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(styles);
    shadowRoot.appendChild(wrapper);
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector('.btn-stop')
      .addEventListener('click', this.dispatchStopEvent.bind(this));
    this.status = 1;
    this.statusText = 'Running';
  }

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

}

window.customElements.define('worker-item', WorkerItem);
