'use strict';
const builds = require('../tinyci.config.js');
const childProcess = require('child_process').exec;

module.exports = function(repository, status, payload, callback) {
  let branch = 'master';
  if (payload.ref) {
    branch = payload.ref.split('/')[2];
  }
  if (builds[repository].watch.indexOf(branch) > -1) {
    status[repository].output = [];
    status[repository].building = true;
    status[repository].hash = (payload.after) ? payload.after : null;
    status[repository].time = Date.now();

    let dir = (builds[repository].dir) ? builds[repository].dir : './';
    let tasks = builds[repository].tasks;
    status[repository].progress[1] = tasks.length;
    (function exec(i) {
      childProcess(`cd ${dir} && ${tasks[i]}`, (err, stdout, stderr) => {
        if (err) {
          status[repository].passed = false;
          status[repository].failed = true;
          status[repository].error = stderr;
          status[repository].output.push(err);
        } else if (stderr) {
          status[repository].error = stderr;
          status[repository].output.push(stderr);
        } else {
          status[repository].output.push(stdout);
          status[repository].failed = false;
          status[repository].error = null;
        }
        status[repository].progress[0] = i + 1;
        if (i + 1 < tasks.length) {
          exec(i + 1);
        } else {
          status[repository].passed = true;
          status[repository].building = false;
          callback(status);
        }
      });
    })(0);
  }
};
