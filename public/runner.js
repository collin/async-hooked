const socket = io(`${location.hostname}:${location.port}`); // eslint-disable-line

socket.on('connect', () => {
  console.log('socket connected');
});

function taskToHTML (world, task) {
  //console.log('taskToHTML', task);
  const children = task.childTaskIds.map(id => ({...world[id], id }));
  const id = task.id ? task.id : 'top'

  return `
    <div data-task-id="${id}" class="task ${task.state}">
      <div>Status: ${task.state}</div>
      <div>Type: ${task.type}</div>
      <div>Path: ${task.path}</div>
      <div>
        ${children.map(child => taskToHTML(world, child)).join('')}
      </div>
    </div>
  `;
}

document.body.addEventListener('mousemove', event => {
  const task = event.target.closest('.task')
  if (!task) return
  const taskId = task.dataset.taskId
  Array.from(document.querySelectorAll('.task-highlight')).forEach(taskEl => {
    taskEl.classList.remove('task-highlight')
  })
  Array.from(document.querySelectorAll(`[data-task-id="${taskId}"]`)).forEach(taskEl => {
    taskEl.classList.add('task-highlight')
  })
})

socket.on('log', (message) => {
  console.log(`LOG`, message)
})

socket.on('world', (rawWorld) => {
  if (rawWorld === '') return
  let world;
  try {
    world = JSON.parse(rawWorld);
  }
  catch (error) {
    console.error('error recieving data', error);
    console.dir('rawWorld', rawWorld);
  }
  if (world) {
    const top = Object.values(world).find(task => task.type === 'top');
    console.log('============ world ======================')
    console.log(world)
    document.body.innerHTML += taskToHTML(world, top);
  }
});
