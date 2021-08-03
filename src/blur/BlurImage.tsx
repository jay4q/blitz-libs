import classNames from 'classnames'
import React, { memo } from 'react'
import { BlurCanvas } from './BlurCanvas'
import { BlurImageProps } from './types'

export const BlurImage = memo<BlurImageProps>(({
  hash,
  punch,
  className,
  width = 32,
  height = 32,
  ...restProps
}) => {
  return (
    <div {...restProps} className={classNames('bl-blur-image', className)}>
      <BlurCanvas
        hash={hash}
        punch={punch}
        width={width}
        height={height}
        className='bl-blur-image__canvas'
      />
    </div>
  )
})