# promise 中 then 的 onRejected vs catch

## catch

### catch 实际捕获上一个 promise 的报错

```
Promise.prototype.catch === Promise.prototype.then(undefined, onRejected)
```

- 不能捕获 异步调用中的 throw

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