import React, { createRef, PureComponent, RefObject } from 'react'
import { decode } from 'blurhash'
import classNames from 'classnames'
import { BlurCanvasProps } from './types'

export class BlurCanvas extends PureComponent<BlurCanvasProps> {
  static defaultProps: Partial<BlurCanvasProps> = {
    height: 32,
    width: 32,
  }

  canvasRef: RefObject<HTMLCanvasElement>

  constructor(props: BlurCanvasProps) {
    super(props)
    this.canvasRef = createRef<HTMLCanvasElement>()
  }

  draw = () => {
    const { hash, height, punch, width } = this.props

    if (this.canvasRef.current) {
      const pixels = decode(hash, width!, height!, punch)
      const ctx = this.canvasRef.current.getContext('2d')

      if (ctx) {
        const imageData = ctx.createImageData(width!, height!)
        imageData.data.set(pixels)
        ctx.putImageData(imageData, 0, 0)
      }
    }
  }

  render() {
    const { hash, height, width, className, ...restProps } = this.props

    return (
      <canvas
        ref={this.canvasRef}
        {...restProps}
        width={width}
        height={height}
        className={classNames('bl-blur-canvas', className)}
      />
    )
  }

  componentDidMount() {
    this.draw()
  }

  componentDidUpdate(prevProps: BlurCanvasProps) {
    if (prevProps.hash !== this.props.hash) {
      this.draw() 
    }
  }
}