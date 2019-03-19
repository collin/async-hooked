const asyncHooks = require('async_hooks');
const fs = require('fs');

const TaskDB  = {};
const addTask = (taskId, parentId, props) => {
  if (parentId && !TaskDB[parentId]) {
    addTask(parentId, null, {
      type: 'top',
      state: 'running',
    });
  }

  if (parentId) {
    TaskDB[parentId].childTaskIds.push(taskId);
  }

  TaskDB[taskId] = {
    ...props,
    childTaskIds: [],
  };
};

const updateTask = (taskId, props) => {
  TaskDB[taskId] = {
    ...TaskDB[taskId],
    ...props,
  };
};

function syncLog () {
  fs.writeSync(1, `${JSON.stringify(TaskDB)}\n`);
}

const asyncHook = asyncHooks.createHook({
  init (asyncId, type, triggerAsyncId, resource) {
    let path = (new Error()).stack.split('\n').slice(2).find(line => !line.match(/internal|timers\.js/)) || ''
    let match = path.match(/\((.+)\)/)
    if (match) path = match[0]
    addTask(asyncId, triggerAsyncId, {
      type,
      //resource,
      path,
      parentId: triggerAsyncId,
      state: 'created',
    });
    syncLog();
  },

  destroy (asyncId) {
    updateTask(asyncId, {
      state: 'destroyed',
    });
    syncLog();
  },

  before (asyncId) {
    updateTask(asyncId, {
      state: 'running',
    });
    syncLog();
  },

  after (asyncId) {
    updateTask(asyncId, { state: 'complete', });
    syncLog();
  },

  promiseResolve (asyncId) {
    syncLog();
  },
});

module.exports = asyncHook;
