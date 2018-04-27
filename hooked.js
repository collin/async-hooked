const fs = require('fs');
const { promisify, } = require('util');
const readFilePromise = promisify(fs.readFile);
const asyncHooks = require('async_hooks');

function syncLog (...msg) {
  fs.writeSync(1, `[log] ${msg}\n`);
}

const asyncHook = asyncHooks.createHook({
  init (asyncId, type, triggerAsyncId, resource) {
    syncLog('init', asyncId, type, triggerAsyncId, resource);
  },

  destroy (asyncId) {
    syncLog('destroy', asyncId);
  },

  before (asyncId) {
    syncLog('before', asyncId);
  },

  after (asyncId) {
    syncLog('after', asyncId);
  },

  promiseResolve (asyncId) {
    syncLog('promise resolved', asyncId);
  },
});

asyncHook.enable();

async function init () {
  try {
    return await readFilePromise('./package.json', 'utf8');
  }
  catch {
    throw new Error('File read failed, sorry :(');
  }
}

init()
  .then(
    packageJSON => {
      console.log('packageJSON', packageJSON);
    }
  )
  .catch(
    error => {
      console.log('promise error...', error);
    }
  );
