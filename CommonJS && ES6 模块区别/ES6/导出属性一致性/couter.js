let counter = 1;
import eventEmitter from './eventemitter';

function increcement () {
    console.log('debug-export-before-counter', counter);
    counter++;
    console.log('debug-export-after-counter', counter);
}

eventEmitter.on('getCounter', function () {
    console.log('debug-export-getCounter-counter', counter);
});

export default {
    counter,
    increcement
}