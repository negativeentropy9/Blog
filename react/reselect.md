# reselect 源码解读

> Selectors can compute derived data, allowing Redux to store the minimal possible state.

> Selectors are efficient. A selector is not recomputed unless one of its arguments changes.

> Selectors are composable. They can be used as input to other selectors.

[源代码](https://github.com/reduxjs/reselect)

源码比较短，加注释才100多行。

## 核心 api

### createSelector

该函数执行返回结果是一个记忆函数，结合 redux 使用时，一般调用生成的 selector 函数的参数是 store。若 store 发生变化，会根据 dependency 值 来重新计算传入 createSelector 的 transform 函数返回值；若 store 不发生变化，直接返回上一个缓存的结果值。

## 相关工具 api

### 默认比较函数

```js
function defaultEqualityCheck(a, b) {
  return a === b
}
```

### 默认记忆函数

```js
export function defaultMemoize(func, equalityCheck = defaultEqualityCheck) {
  let lastArgs = null
  let lastResult = null
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments)
    }

    lastArgs = arguments
    return lastResult
  }
}
```

可定制比较函数和记忆函数，[参考](https://github.com/reduxjs/reselect#customize-equalitycheck-for-defaultmemoize)

[codesandbox demo](https://codesandbox.io/s/reselect-yuanmajiexi-sjxyt)

## 注意事项

- [Sharing Selectors with Props Across Multiple Component Instances](https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances)