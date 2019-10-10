# 【译】React Redux API Hooks

[React Redux 原文](https://react-redux.js.org/api/hooks)

React 新 ["hooks" APIs](https://reactjs.org/docs/hooks-intro.html) 为函数组件提供使用本地组件状态以及执行副作用操作等特性。

现在 React Redux 提供了一系列 hook APIs 来替代已经存在的 `connect()` 高阶组件。 这些 APIs 允许你订阅 Redux store 和派发 actions，使得包裹组件在 `connect()` 里不再是必须。

hooks 在 `v7.1.0` 中首次被添加。

## 在 React Redux App 中使用 Hooks

和 `connect()` 一样，你需要将整个应用包裹在 `<Provider>` 里以确保在组件树中 store 是可用的。

```js
const store = createStore(rootReducer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

从现在开始，你就可以在函数组件里导入和使用列出的 React Redux hooks APIs 了。

### useSelector()

```js
const result : any = useSelector(selector : Function, equalityFn? : Function)
```

#### 基本使用

```js
import React from 'react'
import { useSelector } from 'react-redux'

export const CounterComponent = () => {
  const counter = useSelector(state => state.counter)
  return <div>{counter}</div>
}
```

使用一个 selector 函数，允许 你从 Redux store state 中提取数据

> 注意：selector 必须是纯函数，因为它可能被多次执行

selector 近似于 和 [mapStateToProps argument to connect](https://react-redux.js.org/next/using-react-redux/connect-mapstate) 等价。selector 只接受 Redux store state 作为它仅有的参数。当函数组件渲染时 selector 会被执行。`useSelector()` 将订阅 Redux store，派发 action 时，selector 执行。

然而，`useSelector()`  和 `mapState` 函数参数中的 selectors 还是有很多不同之处。

- selector 可以返回任意值的结果，不局限于一个对象。selector 的返回值将被作为 `useSelector()` hook 的返回值。
- 当派发 action 时，`useSelector()` 会浅比较（===）上一个 selector 的返回值和当前值。如果不相等，组件被重新渲染，否则，不会被重新渲染。
- selector 函数不接受 `ownProps` 参数。但是，props 可以通过闭包（更多细节看下面 [通过闭包使用 props 提取数据](TODO) 例子）来使用或者通过柯里化 selector
- 小心使用 memoizing selectors（更多细节看下面 [使用 memoizing selectors](TODO) 例子）
- `useSelector()` 默认使用严格 `===` 做引用比较，而不是浅比较（更多细节看后面 [相等比较和更新](TODO) 部分）

> 注意：在某些特殊情况下，selectors 中使用 props 可能会报错。看本篇文章中的 [使用注意事项](TODO) 部分来获取更多细节。

你可能在单一函数组件里多次调用 `useSelector()`，每一次调用 `useSelector()` 都创建了单独的 Redux store 订阅。由于在 `React Redux v7` 中，使用了 React 的批量更新特性，在同一个组件中派发一个 action 可能导致多个 `useSelector()`s 返回新值，但是只会导致一次重新渲染。

#### 相等比较和更新

当函数组件渲染时，selector 函数将会被调用，它的结果作为 `useSelector()` hook 的结果返回。（如果 selector 已经运行并且没有改变将会返回一个缓存值。）

但是，当向 Redux store 中派发 action 时，如果 selector 结果不同于上一个值，`useSelector()` 强制重新渲染。和 `v7.1.0-alpha.5` 一样，默认比较为严格 `===` 引用比较。`connect()` 则不一样，mapState 调用的结果使用浅比较来决定是否有必要重新渲染。还有一些如何使用 `useSelector()` 的贴士。

在 `mapState` 中，所有的字段都在一个聚合对象中，不介意是否返回的对象是否是新引用 - `connect()` 仅仅比较每一个字段。在 `useSelector()` 中，默认情况下每一次返回一个新对象总会强制重新渲染。如果想要从 store 中 提取多值，你可以：

- 多次调用 `useSelector()`，每一次调用都返回一个单一字段
- 使用 `Reselect` 或者其他类似库来创建 memoized selector 返回一个聚合的对象，仅在值改变的情况下返回新对象
- 使用 React-Redux 中的 `shallowEqual` 函数作为 `useSelector()` 的参数，如下：

```js
import { shallowEqual, useSelector } from 'react-redux'

// later
const selectedData = useSelector(selectorReturningObject, shallowEqual)
```

可选的比较函数也可以使用 `Lodash` 的 _.isEqual() 或者 `Immutable.js` 的比较特性。

#### 例子

##### 通过闭包使用 props 提取数据

```js
import React from 'react'
import { useSelector } from 'react-redux'

export const TodoListItem = props => {
  const todo = useSelector(state => state.todos[props.id])
  return <div>{todo.text}</div>
}
```

##### 使用 memoizing selectors

当在 `useSelector` 中使用上面示例代码中的 `行内 selector` 时，在组件渲染时，selector 的新实例被创建，在这种情况下，selector 不维护任何状态。然而，memoizing selectors（例如 通过 reselect 创建的 createSelector）有内部 state，因此，使用时要特别注意。从下面你可以找到 memoizing selectors 的特殊使用场景。

当 selector 仅依赖于 state，请确保 selector 定义在 组件外部以便每一次渲染 selector 实例都是相同的。

```js
import React from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

const selectNumOfDoneTodos = createSelector(
  state => state.todos,
  todos => todos.filter(todo => todo.isDone).length
)

export const DoneTodosCounter = () => {
  const NumOfDoneTodos = useSelector(selectNumOfDoneTodos)
  return <div>{NumOfDoneTodos}</div>
}

export const App = () => {
  return (
    <>
      <span>Number of done todos:</span>
      <DoneTodosCounter />
    </>
  )
}
```

如果 selector 依赖于组件的 props，selector 定义在 组件外部，仅被用于单一组件的单例中：

```js
import React from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

const selectNumOfTodosWithIsDoneValue = createSelector(
  state => state.todos,
  (_, isDone) => isDone,
  (todos, isDone) => todos.filter(todo => todo.isDone === isDone).length
)

export const TodoCounterForIsDoneValue = ({ isDone }) => {
  const NumOfTodosWithIsDoneValue = useSelector(state =>
    selectNumOfTodosWithIsDoneValue(state, isDone)
  )

  return <div>{NumOfTodosWithIsDoneValue}</div>
}

export const App = () => {
  return (
    <>
      <span>Number of done todos:</span>
      <TodoCounterForIsDoneValue isDone={true} />
    </>
  )
}
```

然而，如果依赖于组件 props 的 selector 被用于多个组件实例中，你必须确保每一个组件实例都有它自身的的 selector 实例（看 [这里](https://github.com/reduxjs/reselect#accessing-react-props-in-selectors) 获取更多详尽这样做的原因）

```js
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

const makeNumOfTodosWithIsDoneSelector = () =>
  createSelector(
    state => state.todos,
    (_, isDone) => isDone,
    (todos, isDone) => todos.filter(todo => todo.isDone === isDone).length
  )

export const TodoCounterForIsDoneValue = ({ isDone }) => {
  const selectNumOfTodosWithIsDone = useMemo(
    makeNumOfTodosWithIsDoneSelector,
    []
  )

  const numOfTodosWithIsDoneValue = useSelector(state =>
    selectNumOfTodosWithIsDoneValue(state, isDone)
  )

  return <div>{numOfTodosWithIsDoneValue}</div>
}

export const App = () => {
  return (
    <>
      <span>Number of done todos:</span>
      <TodoCounterForIsDoneValue isDone={true} />
      <span>Number of unfinished todos:</span>
      <TodoCounterForIsDoneValue isDone={false} />
    </>
  )
}
```

### useDispatch()

```js
const dispatch = useDispatch()
```

该 hook 返回 Redux store 的 dispatch 函数引用。你可以按照需要来使用它派发 actions。

#### 例子

```js
import React from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => dispatch({ type: 'increment-counter' })}>
        Increment counter
      </button>
    </div>
  )
}
```

当使用 dispatch 传递 callback 给子组件时，推荐使用 useCallback memoize callback，否则，子组件可能会有不必要的渲染。

```js
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()
  const incrementCounter = useCallback(
    () => dispatch({ type: 'increment-counter' }),
    [dispatch]
  )

  return (
    <div>
      <span>{value}</span>
      <MyIncrementButton onIncrement={incrementCounter} />
    </div>
  )
}

export const MyIncrementButton = React.memo(({ onIncrement }) => (
  <button onClick={onIncrement}>Increment counter</button>
))
```

### useStore()

```js
const store = useStore()
```

该 hook 返回一个 与 从 `<Provider>` 组件传递的 Redux store 相同的引用。

该 hook 不应该被频繁使用。`useSelector()` 更应该成为你的首选。但是，该 hook 在某些需要访问 store 的场景下也是有用的，比如说替换 reducers。

```js
import React from 'react'
import { useStore } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const store = useStore()

  // EXAMPLE ONLY! Do not do this in a real app.
  // The component will not automatically update if the store state changes
  return <div>{store.getState()}</div>
}
```

---

## 使用注意事项

#### 过期 Props 和 “僵尸子组件”

React Redux 实现中最棘手的问题是如果你的 `mapStateToProps` 函数以 `(state, ownProps)` 方式定义，保证每次都使用 “最新” 的 props 来调用。在 `v4` 中，在某些边界情况下频繁报出 bug，比如说：列表项的数据被删除，`mapState` 函数抛出异常。

在 `v5` 中，React Redux 尝试保证 ownProps 的一致性。在 `v7` 中，`connect()` 内部使用自定义 `Subscription` 类来实现，不过这种实现导致层级嵌套。这样确保在组件树中层级较深的 `connected` 组件只会在最近的 `connected` 祖先组件更新时，接受 store 更新通知。然而，这依赖于每一个 `connect()` 实例覆盖内部 `React context`，提供唯一 `Subscription` 实例来组成嵌套和使用新的 context 值渲染 `<ReactReduxContext.Provider>`。

使用 hooks，没有途径来渲染 `<ReactReduxContext.Provider>`，这意味着在 subscriptions 中没有层级嵌套。基于此使用 hooks 来替代 `connect()` 可能还会导致在应用中出现 “过期 props” 和 “僵尸子组件” 问题。

明确来言，“过期 props” 发生的场景有：

- selector 函数依赖于组件的 props 来提取数据
- 父组件重新渲染，action 的结果作为 新的 props 来传递
- 组件 selector 函数在组件获取新 props 重新渲染之前执行

这依赖于什么 props 被使用和 当前的 store state 是什么，可能导致从 selector 中返回错误的数据甚至抛出错误

“僵尸” 子组件发生的场景有：

- 多级嵌套 `connected` 组件挂载，导致子组件订阅 store 早于它的父组件。
- 派发 action 从 store 中删除数据，比如说 todo 项目
- 父组件停止渲染子组件
- 子组件首先订阅，并且订阅先于父组件停止渲染子组件。当子组件基于 props 中的 store 读取数据，数据不再存在，如果提取逻辑不小心，可能会导致报错。

`useSelector()` 尝试通过捕获所有错误来解决 store 更新(不是在渲染期间的执行)selector 执行时的报错。在错误发生后，组件被强制渲染，selector 重新执行。只要 selector 是纯函数以及不依赖于 selector 的报错，以上策略会生效。

如果你更喜欢自己解决这个问题，下面是一些避免这些问题可行的使用 `useSelector()` 的解决方案：

- 不要在 selector 函数中依赖 props 来提取数据
- 在 selector 函数中依赖 props 的地方，props 可能随时改变或者你提取的数据可能基于已经删除的项目，试着写防御的 selector 函数，不要直接引用 `state.todos[props.id].name - read state.todos[props.id]`，在尝试读取 `todo.name` 之前先要验证一它是否存在
- 因为 `connect` 添加了必要的 `Subscription` 给 `<ReactReduxContext.Provider>`，并且直到 `connected` 组件重新渲染时才会延迟计算子组件的 subscriptions，在组件树中使用 `useSelector` 的组件上面添加一个 `connected` 组件会避免一些问题，只要 `connected` 组件和 hooks 组件一样，因为同一个 store 更新重新渲染。

> 注意：关于该问题的详情，请看 ["Stale props and zombie children in Redux" by Kai Hao](https://kaihao.dev/posts/Stale-props-and-zombie-children-in-Redux) [this chat log that describes the problems in more detail](https://gist.github.com/markerikson/faac6ae4aca7b82a058e13216a7888ec) 和 [issue #1179](https://github.com/reduxjs/react-redux/issues/1179)

## 优化

正如上面提到的，当 派发 action 后，selector 函数运行时，`useSelector()` 默认做选择数据的引用相等比较，如果选择的数据改变会导致组件重新渲染。然而，不像 `connect()`，`useSelector()` 不会阻止父组件重新渲染导致的组件重新渲染，尽管组件的 props 没有发生变化。

进一步做性能优化是必要的，你可以考虑把你的函数组件包裹在 `React.memo()` 里：

```js
const CounterComponent = ({ name }) => {
  const counter = useSelector(state => state.counter)
  return (
    <div>
      {name}: {counter}
    </div>
  )
}

export const MemoizedCounterComponent = React.memo(CounterComponent)
```

## Hooks 秘籍

聚焦于更小规模的 API 实现我们已经在 alpha 版本中缩减了 hooks API。但是，你可能仍然希望在应用中使用这些方法，可以直接复制粘贴下面的例子到你的代码中。

### 秘籍之一：useActions()

该 hook 在我们原本的 alpha 版本中，但是在 [Dan Abramov's 建议](https://github.com/reduxjs/react-redux/issues/1252#issuecomment-488160930) 下于 `v7.1.0-alpha.4` 中被移除。该建议基于在 hooks 使用场景下 "binding action creators" 不如以前有用，可能会引起很多理解负担的和语法复杂。

你可能更应该在你的组件中调用 `useDispatch` hooks 来获得 dispatch 的引用和需要时在 callbacks 和 effects 中手动调用 `dispatch(someActionCreator())`。你可以在你的代码中使用 Redux [bindActionCreators](https://redux.js.org/api/bindactioncreators) 函数或者像这样 `const boundAddTodo = (text) => dispatch(addTodo(text))` 来 “手动” 绑定。

然而，如果你仍然想要使用该 hook，下面是一个拷贝版本用来支持传递函数、数组和对象类型的 action creators。

```js
import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import { useMemo } from 'react'

export function useActions(actions, deps) {
  const dispatch = useDispatch()
  return useMemo(() => {
    if (Array.isArray(actions)) {
      return actions.map(a => bindActionCreators(a, dispatch))
    }
    return bindActionCreators(actions, dispatch)
  }, deps ? [dispatch, ...deps] : deps)
}
```

### 秘籍之二：useShallowEqualSelector()

```js
import { shallowEqual } from 'react-redux'

export function useShallowEqualSelector(selector) {
  return useSelector(selector, shallowEqual)
}
```

