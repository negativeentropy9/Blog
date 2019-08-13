# React 中的事件

> The SyntheticEvent is pooled. This means that the SyntheticEvent object will be reused and all properties will be nullified after the event callback has been invoked. This is for performance reasons. As such, you cannot access the event in an asynchronous way.

[codesandbox demo](https://codesandbox.io/s/react-persist-event-xf9pd)

## 测试效果

![synthetic-event](../imgs/synthetic-event.gif)

## 总结

- 不要在事件回调的 异步处理中访问 event 对象，此时 event 对象已经被重用，所有属性被清空，包括 `target` 和 `type` 等，如果一定要在异步处理访问跟 event 相关的属性，可以借助于闭包，在异步处理外面把要访问的属性缓存起来

- `setState` 如果采用回调方式更新，那么跟异步处理一样，`setState` 只是一个绑定，而真正执行时才会访问 `event` 对象；如果采用对象方式更新，可以直接绑定其属性。


## 参考

[Event Pooling](https://reactjs.org/docs/events.html#event-pooling)