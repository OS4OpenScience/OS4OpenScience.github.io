var html = require('choo/html')

module.exports = function (button) {
  return html`
    <a class="waves-effect waves-light btn">${button}</a>
  `
}
