# js 中 `generator`（生成器）

> 是什么 -> 不是什么 -> 用来干嘛

## `generator` 是什么？

## API

### next

### throw

## `generator` 不是什么？

### 迭代器

#### 协议

##### （可）迭代（iterator）协议

##### 迭代器协议

## `generator` 用来干嘛？

## `generator` 自动执行器实现

> 比较好的自动执行器参考：[co](https://github.com/tj/co)

### test case

```js
function* gen() {
  yield 1;

  const promise1FullfilledData = yield Promise.resolve(2);

  console.log('debug-promise1FullfilledData', promise1FullfilledData);

  const promise2FullfilledData = yield new Promise(
    (onFullfilled, onRejected) => {
      onFullfilled(3);
    }
  ).then(data => `promise-then-${data}`);

  console.log('debug-promise2FullfilledData', promise2FullfilledData);

  const promiseRejectedError = yield Promise.reject(new Error('promise-error'));

  const promise3FullfilledData = yield new Promise(
    (onFullfilled, onRejected) => {
      setTimeout(() => {
        onFullfilled(4);
      }, 1000);
    }
  ).then(data => `promise-setTimeout-then-${data}`);

  console.log('debug-promise3FullfilledData', promise3FullfilledData);

  return 5;
}
```

### 实现

```js
function generatorExecuter(gen) {
  const generator = gen();

  return new Promise((onFullfilled, onRejected) => {
    recursion(generator.next());

    function recursion(next) {
      // console.log('debug-next', next);

      if (next.done) {
        return onFullfilled(next.value);
      }

      if (next.value instanceof Promise) {
        next.value.then(
          data => {
            recursion(generator.next(data));
          },
          e => {
            let result;

            try {
              result = generator.throw(e);
            } catch (e) {
              result && recursion(result);
              onRejected(e);
            }
          }
        );
      } else {
        recursion(generator.next(next.value));
      }
    }
  });
}
```

### 测试

```js
const re = generatorExecuter(gen);

re.then(data => {
  console.log('debug-re-onFullfilled', data);
}).catch(e => {
  console.log('debug-re-onRejected', e);
});
```

### 遗留问题

## 注意事项

## 总结

## 参考

- [co](https://github.com/tj/co)
- [如何写一个让面试官满意的 Generator 执行器？](https://segmentfault.com/a/1190000020287922)
