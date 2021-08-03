import { encode } from 'blurhash'

// 超过这个宽度（px）的图片需要被进一步压缩，以减少性能耗费
const COMPRESS_THRESHOLD = 256

/**
 * 异步加载图片
 * @param src 
 */
const loadImage = async (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (...args) => reject(args)
    img.src = src
  })

/**
* 获取图片数据
* @param image 
*/
const getImageData = (image: HTMLImageElement) => {
  let targetWidth, targetHeight = 0

  if (image.width > COMPRESS_THRESHOLD) {
    targetWidth = COMPRESS_THRESHOLD
    targetHeight = image.height * COMPRESS_THRESHOLD / image.width
  } else {
    targetWidth = image.width
    targetHeight = image.height
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const context = canvas.getContext('2d')
  context?.drawImage(image, 0, 0, image.width, image.height, 0, 0, targetWidth, targetHeight)
  return context?.getImageData(0, 0, targetWidth, targetHeight)
}

/**
 * 获取图片模糊哈希
 * @param src 
 */
export const getBlurhash = async (src: string | HTMLImageElement) => {
  let image: HTMLImageElement

  if (typeof src === 'string') {
    image = await loadImage(src)
  } else {
    image = src
  }

  const imageData = getImageData(image)

  if (imageData) {
    const res = encode(imageData.data, imageData.width, imageData.height, 4, 4)
    return { hash: res, ratio: imageData.width / imageData.height }
  } else {
    return undefined
  }
}