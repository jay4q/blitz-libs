import classNames from 'classnames'
import React, { HTMLAttributes, memo } from 'react'
import { BlurCanvas } from './BlurCanvas'

export type BlurImageProps = HTMLAttributes<HTMLDivElement> & {
  hash: string
  punch?: number

  /**
   * 画布渲染宽度
   * @description 建议不超过128，默认32
   */
  resolutionWidth?: number

  /**
   * 画布渲染高度
   * @description 建议不超过128，默认32
   */
  resolutionHeight?: number
}

export const BlurImage = memo<BlurImageProps>(({
  hash,
  punch,
  className,
  resolutionWidth = 32,
  resolutionHeight = 32,
  ...restProps
}) => {
  return (
    <div {...restProps} className={classNames('bl-blur-image', className)}>
      <BlurCanvas
        hash={hash}
        punch={punch}
        width={resolutionWidth}
        height={resolutionHeight}
        className='bl-blur-image__canvas'
      />
    </div>
  )
})