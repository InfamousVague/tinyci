'use strict';
// Globals
const {init, build} = require('./modules');
const builds = require('./tinyci.config.js');
const fs = require('fs');
const path = require('path');

let status = init(Object.keys(builds));

// Koa
const koa = require('koa');
const bodyparser = require('koa-bodyparser');
const Router = require('koa-router');
const router = new Router();
const app = koa();

const readFileThunk = function(src) {
  return new Promise(function(resolve, reject) {
    fs.readFile(src, {encoding: 'utf8'}, function(err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

// Use bodyparser and router
app
  .use(bodyparser({
    detectJSON: function(ctx) {
      return /\.json$/i.test(ctx.path);
    }
  }))
  .use(router.routes())
  .use(router.allowedMethods());

// Payload route for GitHub
router.post('/payload', function *(next) {
  let payload = this.request.body;
  this.body = payload;

  // If the repository is in our list of repos, build it.
  if (builds[payload.repository.full_name]) {
    build(payload.repository.full_name, status, payload, newStatus => {
      status = Object.assign({}, status, newStatus);
    });
  }
});

// Send status of CI build for a specific repo to user
router.get('/status/:repo', function *(next) {
  this.body = status[this.params.repo.replace('-', '/')];
});

router.get('/badge/:repo', function *(){
  let buildStatus = status[this.params.repo.replace('-', '/')];
  let svg = (buildStatus.passed) ? '/badges/passed.svg' : '/badges/failed.svg';
  this.body = yield readFileThunk(
    path.join(__dirname, svg)
  );
});

// Send status of CI build to user
router.get('/', function *(next) {
  this.body = status;
});

app.listen(3000);
