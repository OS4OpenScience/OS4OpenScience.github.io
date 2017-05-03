var html = require('choo/html')
var choo = require('choo')
var request = require('browser-request')
var async = require('async')

var repos = require('./templates/repo.js')

var app = choo()

app.use(initialState)
app.use(logger)
app.use(queryGitHub)
app.route('/', mainView)
app.mount('body')

var GH_TOKEN = ""

function initialState (state) {
  state.APIROOT = 'https://api.github.com'
  state.search = '/search/repositories?q=topic:OS4OpenScience'
  state.requestOptions = {
    json: true,
    headers: {
      'Accept': 'application/vnd.github.mercy-preview+json',
      'Authorization': 'token ' + GH_TOKEN
    },
    url: state.APIROOT + state.search
  }
  state.items = []
}

function queryGitHub (state, emitter) {
  request(state.requestOptions, gotRepos)

  function gotRepos (error, response, json) {
    if (error) { console.error(error) }
    state.items = json.items
    async.forEachOf(state.items, requestTopics, done)
  }
  function requestTopics (item, i, next) {
    var requestOptions = state.requestOptions
    requestOptions.url = state.APIROOT + '/repos/' + item.full_name
    request(requestOptions, function (error, response, json) {
      if (error) { console.error(error) }
      state.items[i].topics = json.topics
      next()
    })
  }
  function done () {
    emitter.emit('render')
  }
}

function mainView (state, emit) {
  return html`
    <body>
      <button onclick=${onclick}>Sign in</button>
      <div class="container">
        <div class="row">
          <div class="col s12">
            <h1>OS4OpenScience</h1>
            <div class="divider"></div>
            ${state.items.map(repos)}
          </div>
        </div>
      </div>
    </body>
  `
}

function logger (state, emitter) {
  emitter.on('*', function (messageName, data) {
    console.log('event', messageName, data)
  })
}

function onclick () {
  var url = [
    "https://github.com/login/oauth/authorize",
    "?client_id=8d15d11cbbd8fa957c9a",
    "&scope=email",
    "&redirect_uri=http://127.0.0.1/callback"
  ].join('')
  window.location.replace(url)
}