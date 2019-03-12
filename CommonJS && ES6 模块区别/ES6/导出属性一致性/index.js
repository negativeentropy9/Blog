import counter from './couter';
import eventEmitter from './eventemitter';
import a from './a';

console.log('debug-counter-before-increcement', counter.counter);

counter.increcement();

console.log('debug-counter-after-increcement', counter.counter);

counter.counter = 5;

eventEmitter.emit('getCounter');

console.log('debug-counter-after-赋值', counter.counter);

console.log('debug-counter-a', a.counter);