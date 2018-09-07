const spawn = require('child_process').spawn;
const pythonProcess = spawn('python',['./test.py', 1, 2, 3]);

// TODO: figure out error handling from python
pythonProcess.stdout.on('data', (data) => {
    console.log('data from node: ' + data);
});
