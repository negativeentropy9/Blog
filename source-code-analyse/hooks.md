# React hooks 源码分析

昨天 [司徒正美](https://twitter.com/jslouvre) 过世，据传病因为颈椎病，本人无处证实其真实病因。说是屌丝逆袭的典范，虽早已脱离穷的状态，仍然与人合租，生活简朴，一件冬衣穿多年，关心社会，具有责任感。R.I.P.愿大家都能珍惜当下，积极乐观生活，不留遗憾。

入口为 详见 _packages/react-reconciler/src/ReactFiberHooks.js_ 中的 _renderWithHooks_ 函数，下面主要从组件的生命周期中比较重要的 _mount_ 和 _update_ 分析 `hooks` api 中的 `useState` 和 `useEffect`。

> 代码中混杂着 `schedule` 和 `suspense` 相关的，在这里可以暂时先忽略。本文章适用于对 `hooks` 有一定使用经验的开发者，如果您刚刚开始学习 `React`，建议先把 [`React` 官方文档](https://reactjs.org/docs/getting-started.html) 看一遍，并且经过一定练习，然后按照下面的途径走一遍；如果您刚刚开始接触 `hooks`，建议先把 [`hooks` 官方文档](https://reactjs.org/docs/hooks-intro.html) 看一遍，并且经过一定练习。

## 术语表

- `hooks` _api_ (`useState`/`useEffect` 等)
- _mount_ 阶段为组件挂载时
- _update_ 阶段为组件更新时

## 存储结构

采用 _单链表_ 结构在 _mount_ 函数组件时根据 `hooks` _api_ 的调用顺序进行初始化(详见 _packages/react-reconciler/src/ReactFiberHooks.js_ 中的 _mountWorkInProgressHook_ 函数)

![`hooks` 存储数据结构](/imgs/react-hooks-data-structure.png)

其中 _memoizedState_ 字段存储 _state_ 值(`useState`)，或者 _effect_ 相关信息(`useEffect`)；_next_ 指向下一个 `hooks` 节点；_queue_ 在 `useState` 下存储 _dispatch_ 函数和 `fiber` 队列。

### `fiber` 节点存储类型

![`fiber` 节点存储类型](/imgs/react-fiber-type.png)

`hooks` 相关数据存储在 _fiber_ 节点下的 _memoizedState_ 字段下。

### `useState` 节点存储类型

![`useState` 节点存储类型](/imgs/react-hooks-useState-structure.png)

### `useEffect` 节点存储类型

![`useEffect` 节点存储类型](/imgs/react-hooks-useEffect-structure.png)

## 阶段

### mount

在 _mount_ 阶段，每调用一次 `hooks` _api_ 都会按照顺序初始化单链表(详见 _packages/react-reconciler/src/ReactFiberHooks.js_ 中的 _mountWorkInProgressHook_ 函数)

### update

在 _update_ 阶段，每调用一次 `hooks` _api_ 都会从单链表中取已经存储的 `hook` 节点数据(详见 _packages/react-reconciler/src/ReactFiberHooks.js_ 中的 _updateWorkInProgressHook_ 函数)，`useState` 取出 _memoizedState_ 和 _queue.dispatch_。

## 源码调试

使用 [create-react-app](https://create-react-app.dev/) 创建项目，`React` 基于 _16.3.1_ 版本，_node_moduels_ 下面的 `react` & `react-dom` 目录下的 _cjs/\*(react/react-dom).development.js_ 直接 _debug_，可以直接克隆项目进行调试。

```bash
$ git clone git@github.com:doudounannan/react-debugger.git
$ cd react-debugger
$ ck hooks
$ yarn install
$ yarn start
```

## 简单实现一个 `hooks`

以下代码只是简单实现了一个 _mount_ 和 _update_ 初始化和更新的操作

```js
class Event {
  name = "";
  poor = {};

  constructor(name) {
    this.name = name;
  }

  onOne(eventName, eventCb) {
    this.poor[eventName] = eventCb;
  }

  emit(eventName, data) {
    this.poor[eventName]();
  }
}

const event = new Event("simulation");

const currentFiberNode = {
  memoizedState: null
};

let currentHook = null;

let hasMounted = false;

function mountState() {
  const hooks = {
    next: null,
    dispatch: null
  };

  if (currentHook) {
    currentHook.next = hooks;
  } else {
    currentFiberNode.memoizedState = hooks;
  }

  currentHook = hooks;

  return hooks;
}

function updateState() {
  const hooks = {
    ...currentHook
  };

  currentHook = currentHook.next;

  return hooks;
}

function mountUseState(state) {
  if (typeof state === "function") {
    state = state();
  }

  const hooks = mountState();

  hooks.memoizedState = state;
  hooks.dispatch = action => {
    if (typeof action === "function") {
      hooks.memoizedState = action(hooks.memoizedState);
    } else {
      hooks.memoizedState = action;
    }
  };

  return [hooks.memoizedState, hooks.dispatch];
}

function updateUseState(state) {
  const hooks = updateState();

  return [hooks.memoizedState, hooks.dispatch];
}

function useState(state) {
  if (hasMounted) {
    return updateUseState(state);
  } else {
    return mountUseState(state);
  }
}

function commit(...data) {
  console.log(data);

  if (!hasMounted) {
    hasMounted = true;
  }

  currentHook = currentFiberNode.memoizedState;
}

function FC() {
  const [count, setCount] = useState(0);
  const [isHappy, setIsHappy] = useState(false);

  event.onOne("update-count", function updateCount() {
    console.log("debug-after-update-count");
    setCount(count => count + 1);
    FC();
  });

  event.onOne("update-isHappy", function updateIsHappy() {
    console.log("debug-after-update-isHappy");
    setIsHappy(!isHappy);
    FC();
  });

  console.log("debug-render: count & isHappy");
  commit(count, isHappy);
}

// like mount
FC();

// like update
event.emit("update-count");
event.emit("update-isHappy");
```

## 后续

- reconciler
- render phase
- commit phase

## FAQ

[官方文档](https://reactjs.org/docs/hooks-intro.html) 其实已经介绍的非常详细了，[常见问题](https://reactjs.org/docs/hooks-faq.html) 也已经总结的很全面。在这里主要从源码的角度上详细讲几个为什么要这样设计的原因(官方文档上很多是讲如果不这样做，会有怎样的问题，没有明确指出为什么)。

### 为什么使用单链表形式存储 `hooks`？

现在 `React` 提供给 _functional component_ 维护 _local state_ 的 _api_ 只有一个 `useState`。跟 _class component_ 中 `setState` 不同的是：`setState` 将所有数据存储在一个对象中，调用其进行更新时，更新后的 _state_ 和旧有 `state` 做浅合并；而 `useState` 提供了一个选项把每个 `state` 单值分别存储，再加上还有其他 `hooks` api，比如说 `useEffect`、`useReducer` 和 `useContext` 等，而且需要维护所有 `hooks` _api_ _render_ 时的状态，是不是单链表更好呢。是否有更合适的数据结构用来存储 `hooks`，暂时想不到

### 为什么在使用 _函数_ 进行初始化 `useState` 时，可以做到惰性执行？

首先，无论是表达式还是函数都是作为 `useState` 的参数存在的，表达式作为形参来传递，每次函数调用都会运行表达式(详见 _packages/react-reconciler/src/ReactFiberHooks.js_ 中的 _updateState_ 函数)。看下面的例子，可能理解起来就没有那么困难了。

```js
var count1 = 0;
var count2 = 0;

var expansiveComputeVariable = (function() {
  count1++;
  console.log("debug-expansiveComputeVariable-call");

  for (let i = 0; i < 10000; i++);

  return count1;
})();

var expansiveComputeFun = () => {
  count2++;
  console.log("debug-expansiveComputeFun-call");

  for (let i = 0; i < 10000; i++);

  return count2;
};

function fun(data) {
  return data;
}

console.log(
  "debug-fun(expansiveComputeVariable)",
  fun(expansiveComputeVariable)
);
console.log("debug-fun(expansiveComputeFun)", fun(expansiveComputeFun));
```

以上分析是按照个人认为能够理解的脉络阐述的，如果您认为哪里比较混乱，欢迎与我联系。如果哪里有理解上的错误，请一定帮忙指出。如果您也有阅读源码的兴趣，欢迎一起交流。
