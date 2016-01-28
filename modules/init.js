'use strict';
module.exports = function(repos) {
  let status = {};
  repos.map(repo => {
    status[repo] = {
      progress: [null, null],
      error: null,
      building: null,
      failed: null,
      hash: null,
      time: null,
      passed: null,
      output: null
    };
  });
  return status;
};
