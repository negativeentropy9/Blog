let counter = 1;

function increcement () {
    counter++;
    console.log('debug-exports-counter-increcement-内部修改', counter);
}

const EventEmitter = require('./eventEmitter');

EventEmitter.on('modify', function modify () {
   console.log('debug-exports-modify-counter-内部修改前', counter);
   counter = 5;
   console.log('debug-exports-modify-counter-内部修改后', counter);
});

module.exports = {
    counter,
    increcement
}