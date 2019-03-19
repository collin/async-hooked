const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const childProcess = require('child_process');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log(`Socket connection: ${socket.id}`);
});


const path = require('path');
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/track-this', (req, res, next) => {
  const child = childProcess.spawn('node', ['async-tracker.js', ]);
  child.stdout.on('data', chunk => {
    chunk.toString().split('\n').forEach(line => {
      if (line.startsWith('OUT')) {
        io.emit('log', line)
      }
      else {
        io.emit('world', line);
      }
    });
  });
  child.on('exit', (d) => {
    res.end('okay')
  });
});

server.listen(3000, () => {
  console.log('listening!');
});
/*
const { promisify, } = require('util');
const readFilePromise = promisify(fs.readFile);
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
*/
