import { CanvasHTMLAttributes, HTMLAttributes } from 'react'

export type BlurBaseProps = {
  /**
   * @description 模糊图的哈希值
   */
  hash: string

  /**
   * @description 具体不清楚什么作用，可以参考文档 https://github.com/woltapp/blurhash
   * @default undefined
   */
  punch?: number

  /**
   * @description 画布渲染宽度，建议不超过128，保证绘制性能
   * @default 32
   */
  width?: number

  /**
   * @description 画布渲染高度
   * @default 32
   */
  height?: number
}

export type BlurCanvasProps = CanvasHTMLAttributes<HTMLCanvasElement> & BlurBaseProps

export type BlurImageProps = HTMLAttributes<HTMLDivElement> & BlurBaseProps