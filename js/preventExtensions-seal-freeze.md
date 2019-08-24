# js 阻止对象可被扩展 Object.freeze vs Object.seal vs Object.preventExtensions

## Object.freeze()

> 一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。

为浅冻结，如对象属性值仍为对象，需递归调用 `Object.freeze`

### 检测

- Object.isFrozen()


## Object.seal()

> 密封一个对象会让这个对象变的不能添加新属性，且所有已有属性会变的不可配置。属性不可配置的效果就是属性变的不可删除，以及一个数据属性不能被重新定义成为访问器属性，或者反之。但属性的值仍然可以修改。尝试删除一个密封对象的属性或者将某个密封对象的属性从数据属性转换成访问器属性，结果会静默失败或抛出TypeError

### 检测

- Object.isSealed()


## Object.preventExtensions()

> Object.preventExtensions()将对象标记为不再可扩展，因此它将永远不会具有超出它被标记为不可扩展的属性。注意，一般来说，不可扩展对象的属性可能仍然可被删除。尝试将新属性添加到不可扩展对象将静默失败或抛出TypeError

### 检测

- Object.isExtensible()

## 对比

| 函数  | 添加属性  | 删除属性  | 修改已有属性  | 修改原型  | 重写原型 |
|---|---|---|---|---|---|
| Object.freeze  | 否  | 否  | 否  | 是  | 否  |
| Object.seal  | 否  | 否  | 是  | 是  | 否  |
| Object.preventExtensions  | 否  | 是  | 是  | 是  | 否  |

## 参考

- [Object.freeze()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
- [Object.seal()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)
- [Object.preventExtensions()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)