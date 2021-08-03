# 常用业务库

总结在前端业务（React）开发过程中，一些常用的UI组件、工具函数。主要服务于 [blitz-admin](https://github.com/jay4q/blitz-admin) 以及个人的其它前端业务

## 安装

``` bash
yarn add blitz-libs
```

## 组件维护注意事项

> TLDR;

1. `dumi` 会把所有继承的组件属性解析出来，如 `type Props = CanvasHTMLAttributes<HTMLCanvasElement> & { //... }` 导致许多不必要的属性显示在文档里，对于这种情况不要直接用 [组件API自动生成](https://d.umijs.org/zh-CN/guide/advanced#%E7%BB%84%E4%BB%B6-api-%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90) 请自行维护属性表

## Todo

+ [ ] 研究下是否可以部署至 gh-pages
+ [ ] 支持按需加载
+ [ ] 优化一下首页的图标、说明文字
