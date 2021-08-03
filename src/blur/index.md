---
title: 图片模糊占位图
nav:
  title: UI组件
  path: /ui-component
group:
  title: 图片组件
  path: /image
---

## 生成模糊哈希值

1. 封装了 [blurhash](https://github.com/woltapp/blurhash/tree/master/TypeScript) 工具库，简化开发者使用成本
2. 通过图片压缩，优化了绘制性能

``` tsx
import React, { createRef, InputHTMLAttributes, Component } from 'react'
import { getBlurhash, BlurImage } from 'blitz-libs'

export default class Input extends React.Component {
  private inputRef = createRef<HTMLInputElement>()

  private readonly state = {
    hash: undefined,
    ratio: 0,
  }

  onSelect: InputHTMLAttributes<HTMLInputElement>['onChange'] = async e => {
    const { files } = e.target

    if (files?.length !== 1) {
      window.alert('已经取消图片选择')
      return
    }

    try {
      const { hash, ratio } = await getBlurhash(URL.createObjectURL(files[0]))
      this.setState({ hash, ratio })
    } catch (e) {
      window.alert(e.message || '图片上传失败，请稍后再试')
    }
  }

  render() {
    const { hash, ratio } = this.state

    return (
      <>
        <input ref={this.inputRef} type='file' accept='image/*' onChange={this.onSelect} />
        <h3>处理结果</h3>
        <p>图片哈希：{hash}</p>
        <p>图片宽高比：{ratio}</p>
        {
          hash && ratio && (
            <BlurImage hash={hash} style={{ width: '360px', height: (360 / ratio) + 'px' }} />
          )
        }
      </>
    )
  }
}
```

## BlurCanvas

1. 封装了 [blurhash](https://github.com/woltapp/blurhash/tree/master/TypeScript) 工具库，根据模糊图哈希值，解析为模糊图并绘至画布
2. 需要注意的是 `BlurCanvas` 的宽高不能设置太大（代码中默认 `32*32`），否则画布绘制会耗费不少时间

``` tsx
import React from 'react'
import { BlurCanvas } from 'blitz-libs'

export default () => {
  return (
    <BlurCanvas hash='UG6eL%r:L}cupAjFVtk=Q8k;obo~pLQ+kCo~' />
  )
}
```

## BlurImage

1. 对 `BlurCanvas` 的进一步封装。创建了一个外包裹，通过开发者通过注入样式，得以控制模糊图的大小
2. 在实际使用时，也是建议直接使用 `BlurImage` 即可，除非有特殊的需求再去使用 `BlurCanvas`

``` tsx
import React from 'react'
import { BlurImage } from 'blitz-libs'

export default () => {
  return (
    <BlurImage hash='UG6eL%r:L}cupAjFVtk=Q8k;obo~pLQ+kCo~' style={{ width: '256px', height: '256px' }} />
  )
}
```
