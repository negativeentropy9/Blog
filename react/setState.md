# React 中的 setState 用法

> setState() enqueues changes to the component state and tells React that this component and its children need to be re-rendered with the updated state. This is the primary method you use to update the user interface in response to event handlers and server responses.

## setState 更新操作

本质是类似于 `Object.assign` 的浅合并

## 使用

### setState(stateChange[, callback])

> This performs a shallow merge of stateChange into the new state

```js
this.setState({
  count: this.state.count + 1
});

this.setState({
  count: this.state.count + 1
});
```

以上代码等价于

```js
Object.assign(this.state, {
  count: this.state.count + 1,
  count: this.state.count + 1
});
```

所以以上代码只加 1 次

### setState((state, props) => stateChange[, callback])

> Both state and props received by the updater function are guaranteed to be up-to-date. The output of the updater is shallowly merged with state.

```js
this.setState(state => {
  return {
    counter: state.counter + 1
  };
});

this.setState(state => {
  return {
    counter: state.counter + 1
  };
});
```

以上代码会加 2 次

## 同步异步性

### 同步

绕过 React 通过 addEventListener 直接添加的事件处理函数，还有通过 setTimeout/setInterval 产生的异步调用。

### 异步

> 在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中回头再说，而 isBatchingUpdates 默认是 false，也就表示 setState 会同步更新 this.state，但是，有一个函数 batchedUpdates，这个函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会调用这个 batchedUpdates，造成的后果，就是由 React 控制的事件处理过程 setState 不会同步更新 this.state。

由 `React` 引发的事件处理，比如说 `onClick`，都是异步的，即在 使用 `setState` 修改 过后立即访问 `state` 修改的变量仍不是最新值。

[sandbox demo](https://codesandbox.io/s/react-setstate-4wxri)

### 测试效果

![react-setState](/imgs/react-setState.gif)

#### 分析

- 首先看 `componentDidMount` 生命周期里面，使用对象方式更新，发现 `count` 字段只被加了 1 次，且是异步的；紧接着，后面有个 `setTimeout` 的异步回调，发现 `count` 字段被 同步 加了 2 次；
- 第一个按钮点击触发 `react` 事件，在更新 `state` 中使用 `update callback` 方式，异步加了 3 次；
- 第二个按钮点击触发 `react` 事件，在更新 `state` 中使用 `object` 方式，异步被加了 1 次
- 第三个按钮绑定了原生事件，发现 `count` 字段 被同步加了 2 次

## 总结

- 尽量不要在 setState 修改 state 过后立即访问 state 获取最新值，应该在 componentDidUpdate 生命周期里面做这件事
- 尽量使用 update callback 这种方式来修改，在 16+ 下走 fiber 渲染

## 参考

- [react setState](https://reactjs.org/docs/react-component.html#setstate)
- [setState In React: 淺談 React 中 setState 的使用-同步 or 非同步？](https://medium.com/@brianwu291/learn-basic-react-setstate-function-2aec5018a38a)
- [When is setState asynchronous?](https://reactjs.org/docs/faq-state.html#when-is-setstate-asynchronous)
- [What is the difference between passing an object or a function in setState?](https://reactjs.org/docs/faq-state.html#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate)
- [Why is setState giving me the wrong value?](https://reactjs.org/docs/faq-state.html#why-is-setstate-giving-me-the-wrong-value)
- [深入 setState 机制](https://github.com/sisterAn/blog/issues/26)
