# ECMA2015 promise

## api

### Promise.prototype.then

#### 参数不合理

> 如果忽略针对某个状态的回调函数参数，或者提供非函数 (nonfunction) 参数，那么 then 方法将会丢失关于该状态的回调函数信息，但是并不会产生错误。如果调用 then 的 Promise 的状态（fulfillment 或 rejection）发生改变，但是 then 中并没有关于这种状态的回调函数，那么 then 将创建一个没有经过回调函数处理的新 Promise 对象，这个新 Promise 只是简单地接受调用这个 then 的原 Promise 的终态作为它的终态。

```js
new Promise((resolve, reject) => {
    resolve({name: 'yiyi'})
}).then().then((data) => {
    console.log('debug-data', data); // debug-data {name: "yiyi"}
}, (e) => {
    console.log('debug-reject', e);
})
```

#### then 调用过程中 onResolved 和 onRejected 的执行 取决于 调用者的 promise 状态

##### 例一

```js
new Promise((resolve, reject) => {
  reject('error')
}).then(() => {

}, (e) => {
  console.log('debug-onRejected', e); // debug-onRejected error
}).then((data) => {
  console.log('debug-then-onFullfilled-data', data); // debug-then-onFullfilled-data undefined
}, (e) => {
  console.log('debug-then-onRejected-e', e);
})
```

##### 例二

```js
Promise.reject('reject').catch((e) => {
    console.log('debug-e', e); // debug-e reject
}).then((data) => {
    console.log('debug-then-data', data); // debug-then-data undefined
}, (e) => {
    console.log('debug-then-e', e);
})
```

### Promise.prototype.all

> 如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 promise 的结果。

```js
var t1 = new Promise((resolve,reject)=>{
  console.log('debug-t1');
    setTimeout(() => reject("t1-error"), 2000)
})
var t2 = new Promise((resolve,reject)=>{
  console.log('debug-t2');
    setTimeout(() => resolve("t2-success"), 1000)
})
var t3 =new Promise((resolve,reject)=>{
  console.log('debug-t3');
    setTimeout(() => reject("t3-error"), 500)
})
Promise.all([t1,t2,t3]).then(res=>{
    console.log(res)
}).catch(error=>{
    console.log(error)
})
// 打印出来是t3-error
```

### Promise.prototype.race

> Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。

## 参考

- [mdn-promise then](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)