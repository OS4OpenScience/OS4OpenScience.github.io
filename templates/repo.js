var html = require('choo/html')
var button = require('./button.js')

module.exports = function (repo) {
  return html`
  <div class="row">
    <div class="col s12">
      <h3><a href=${repo.html_url}>${repo.full_name}</a></h3>
      ${repo.topics.map(button)}
    </div>
  </div>
  `
}
