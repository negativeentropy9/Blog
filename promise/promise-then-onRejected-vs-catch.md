# promise 中 then 的 onRejected vs catch

## 区别

### catch 实际捕获上一个 promise 的报错

```
Promise.prototype.catch === Promise.prototype.then(undefined, onRejected)
```

- 不能捕获 异步调用中的 throw


```js
var p = new Promise(function (resove, reject){

   throw new Error('hehe');
})

p.then(function success(e){
    console.log(e);
}, function fail(e){throw new Error('test')
    console.log('reject',e); // 实际这里会打印hehe
}).catch(function (e){
    console.log('catch',e); // 这里不执行
})
```

## 参考

- [promise-catch-vs-rejec](https://www.css3.io/promise-catch-vs-reject.html)
- [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)