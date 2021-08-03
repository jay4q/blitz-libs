---
title: 图片展示组件
nav:
  title: UI组件
  path: /ui-component
group:
  title: 图片组件
  path: /image
---

## 图片展示组件

1. 支持懒加载
2. 支持使用模糊哈希值生成占位图
3. 如果未提供，支持 fallback 至纯色占位
4. 图片默认支持点击放大

``` tsx
import React from 'react'
import { Image } from 'blitz-libs'

export default () => {
  return (
    <>
      <Image 
        zoomable
        alt=''
        hash='UG6eL%r:L}cupAjFVtk=Q8k;obo~pLQ+kCo~'
        style={{ width: 375, height: 469 }}
        src='https://images.pexels.com/photos/8680266/pexels-photo-8680266.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'
      />
      <br />
      <Image 
        zoomable
        alt=''
        color='#2E8B57'
        style={{ width: 375, height: 469 }}
        src='https://images.pexels.com/photos/8680266/pexels-photo-8680266.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'
      />
    </>
  )
}
```
