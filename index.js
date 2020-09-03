/**
 * This function generate a RFC4122 v4 compliant UUID.
 * (see : https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523)
 */
function generateUUIDv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,
    c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function showExample(element) {
  const container = document.getElementById('example-container');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  fetch(`./elements/${element}/${element}-example.html`).then(res => res.text()).then(
    example => {
      const d = (new DOMParser()).parseFromString(example, 'text/html');
      container.appendChild( d.querySelector('.html') );
      container.appendChild( d.querySelector('style') );
      const script = document.createElement('script');
      script.appendChild(
        document.createTextNode( d.querySelector('script').textContent )
      );
      container.appendChild(script);
    }
  );
}
