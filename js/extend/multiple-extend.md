# js 中多重继承的实现

## 比较好的继承方式

### 原型式借用构造组合继承

```js
function object (o) {
    function F () {}
    F.prototype = o;

    return new F();
}

function inheritPrototype (Sub, Super) {
    var proto = object(Super.prototype);
    proto.constructor = Sub;
    Sub.prototype = proto;
}

function Super () {

}

function Sub () {
    Super.call(this);
}
inheritPrototype(Sub, Super);
```

下面我们借用 `原型式借用构造组合继承` 来实现多重继承

```js
function A() {
  this.class = 'A';
}

A.prototype.sayClass = () => {
  console.log('debug-sayClass', this.class);
}

function B () {
  this.name = 'B';
}

B.prototype.sayName = () => {
  console.log('debug-sayName', this.name);
}

function C () {
  A.apply(this);
  B.apply(this)
  this.type = 'C';
}

C.prototype = Object.create(Object.assign({}, A.prototype, B.prototype));

var c = new C();

c.sayClass();
c.sayName();
```

## 参考

- [javascript继承的演变](https://www.css3.io/javascript-extend-history.html)