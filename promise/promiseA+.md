# ECMA2015 promise 实现

## api

### then

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

## 参考

- [mdn-promise then](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)