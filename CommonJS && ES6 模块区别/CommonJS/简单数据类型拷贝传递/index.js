let counterIns;
counterIns = require('./couter');
const EventEmitter = require('./eventEmitter');

console.log('debug-require-couter-原始数据', counterIns.counter);

counterIns = require('./couter');

counterIns.increcement();

console.log('debug-require-couter-调用暴露接口 increcement 修改后', counterIns.counter);

counterIns.counter = 10;

console.log('debug-require-couter-外部修改后', counterIns.counter);

console.log('debug-cache-couter', require.cache[require.resolve('./couter')].exports);


EventEmitter.emit('modify');

console.log('debug-require-couter-内部修改后', counterIns.counter);

console.log('debug-cache-couter', require.cache[require.resolve('./couter')].exports);

// const decache = require('decache');
//
// decache('./couter');
//
// counterIns = require('./couter');
//
// console.log('debug-cache-couter', require.cache[require.resolve('./couter')].exports);
//
// console.log('debug-require-couter-删除缓存后', counterIns.counter);

const a = require('./a');

console.log('debug-a-counter', a.counter);