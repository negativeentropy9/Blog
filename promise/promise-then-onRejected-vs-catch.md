# promise 中 then 的 onRejected vs catch

## catch

```
Promise.prototype.catch === Promise.prototype.then(undefined, onRejected)
```

### catch 实际捕获最近的 promise 的报错

Promise对象的错误具有冒泡性质，会一直向后传递，直到被捕获为止，也就是说错误总会被下一个catch语句捕获。

```js
Promise.reject('error').then((data) => {
  console.log('debug-data',data)
}, e => {
  console.log('debug-then-fail', e); // debug-then-fail error
}).catch(e => {
  console.log('debug-catch', e);
});

Promise.reject('error').then((data) => {
  console.log('debug-data',data);
}).catch(e => {
  console.log('debug-catch', e); // debug-catch error
});
```


###  不能捕获 异步调用中的 throw

```js
// 在异步函数中抛出的错误不会被catch捕获到
var p2 = new Promise(function(resolve, reject) {
  setTimeout(function() {
    throw 'Uncaught Exception!';
  }, 1000);
});

p2.catch(function(e) {
  console.log(e); // 不会执行
});
```

### 在resolve()后面抛出的错误会被忽略

如果Promise状态以及变成resolved，再抛出错误是无效的。因为Promise的状态一旦改变，就永久保持该状态，不会再变了。

```js
// 在resolve()后面抛出的错误会被忽略
var p3 = new Promise(function(resolve, reject) {
  resolve();
  throw 'Silenced Exception!';
});

p3.catch(function(e) {
   console.log(e); // 不会执行
});
```

[sandbox demo](https://codesandbox.io/s/promise-reject-vs-catch-x8snd)

## 参考

- [promise-catch-vs-rejec](https://www.css3.io/promise-catch-vs-reject.html)
- [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)