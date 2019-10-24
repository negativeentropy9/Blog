# antd 组件库设计之 button 组件 分析

[Button按钮](https://ant.design/components/button-cn/)

该组件实现为一个 class 组件。

## 组件功能

### 水波纹

主要使用伪元素 针对 `box-shadow` 做 `keyframes` 动画实现。

具体实现相关代码：ant-design/components/_util/wave.tsx

## 数据通信

### props

一个好的组件，默认配置是必须的，通过 `defaultProps` 指定默认配置

传入的 props 类型通过 `prop-types` 进行校验

### 全局化配置

[ConfigProvider全局化配置](https://ant.design/components/config-provider-cn/#API)

具体 `context` 实现相关代码在 ant-design/components/config-provider/index.tsx

主要从 `ConfigProvider` 中获取全局配置的 空状态组件 renderEmpty、csp、样式前缀prefixCls等，具体可参考 [sandbox demo](https://codesandbox.io/s/antd-ekhpu)查看具体配置

## 组件兼容性

[react-lifecycles-compat](https://github.com/reactjs/react-lifecycles-compat) 做 polyfill，防止生命周期被废弃。

## 总结

其他组件诸如 table、tabs 基本实现思路一致，本文只是以一个简单组件来分析 antd 代码具体实现。

## TODO

- style
- dynamic import




