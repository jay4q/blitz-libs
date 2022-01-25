import './index.css';
import React, {
  ImgHTMLAttributes,
  useCallback,
  useMemo,
  useState,
  FunctionComponent,
  useEffect,
  CSSProperties,
} from 'react';
import mediumZoom, { Zoom } from 'medium-zoom';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import qs from 'query-string';
import {
  checkImageLoaded,
  setLoadedImage,
  useNativeLazyLoading,
} from './helper';
import { BlurImage } from '../blur';

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /**
   * @description 模糊图的哈希值
   */
  hash?: string;

  /**
   * @description 图片主色，用于占位
   */
  color?: string;

  /**
   * @description 是否支持缩放
   * @default false
   */
  zoomable?: boolean;

  /**
   * @description 图片宽高比
   */
  ratio?: number;

  /**
   * @description 图片样式
   */
  imageStyle?: CSSProperties;
};

export const Image: FunctionComponent<ImageProps> = ({
  onLoad,
  onClick,
  style,
  className,
  children,
  imageStyle,
  hash: _hash,
  color: _color,
  ratio: _ratio,
  zoomable = false,
  ...restProps
}) => {
  const [zoomRef, setZoomRef] = useState<Zoom>();

  const supportsLazyLoading = useNativeLazyLoading();
  const { ref, inView } = useInView({
    triggerOnce: true,
    skip: supportsLazyLoading !== false,
  });

  const [isLoaded, setImageLoaded] = useState(false);
  const [delayLoaded, setDelayLoaded] = useState(false);
  const isLoadedBefore = checkImageLoaded(restProps.src);

  const { hash, color, ratio } = useMemo(() => {
    try {
      if (!restProps.src) throw new Error();

      // 解析链接中的参数
      const query = qs.parseUrl(restProps.src).query;
      return {
        hash: (query['hash'] as string) || _hash,
        color: (query['color'] as string) || _color,
        ratio: Number(query['width']) / Number(query['height']) || _ratio,
      };
    } catch (err) {
      return {
        hash: _hash,
        color: _color,
        ratio: _ratio,
      };
    }
  }, [_hash, _color, _ratio, restProps.src]);

  // 兼容图片缩放模式
  const attachZoom = useCallback(
    (ref) => {
      if (!zoomRef) return;

      if (zoomable) {
        zoomRef.attach(ref);
      } else {
        zoomRef.detach(ref);
      }
    },
    [zoomable, zoomRef],
  );

  // 图片加载回调
  const onImageLoad = useCallback(
    (e: any) => {
      setImageLoaded(true);

      if (onLoad) {
        onLoad(e);
      }

      if (hash || color) {
        // 如果有模糊图或者纯色，加载完毕后延迟从视图中移除
        setTimeout(() => {
          setDelayLoaded(true);
          setLoadedImage(restProps.src);
        }, 500);
      }
    },
    [color, hash, onLoad, restProps.src],
  );

  // 图片点击事件
  const onImageClick = useCallback(
    (e: any) => {
      if (!zoomable && onClick) {
        onClick(e);
      }
    },
    [zoomable, onClick],
  );

  useEffect(() => {
    setZoomRef(mediumZoom());
  }, []);

  return (
    <div
      ref={ref}
      style={style}
      className={classNames('bl-image', className)}
      onClick={onImageClick}
    >
      {ratio && (
        <div
          className="bl-image__box"
          style={{ paddingBottom: (1 / ratio) * 100 + '%' }}
        ></div>
      )}
      {(isLoadedBefore || inView || supportsLazyLoading) && (
        <img
          alt="img"
          {...restProps}
          ref={attachZoom}
          loading="lazy"
          className="bl-image__img"
          style={imageStyle}
          onLoad={onImageLoad}
        />
      )}
      {!isLoadedBefore && !hash && color && !delayLoaded && (
        <div
          style={{ background: color }}
          className={classNames(
            'bl-image__ph',
            isLoaded && 'bl-image__ph--hidden',
          )}
        ></div>
      )}
      {!isLoadedBefore && hash && !delayLoaded && (
        <BlurImage
          hash={hash}
          className={classNames(
            'bl-image__ph',
            isLoaded && 'bl-image__ph--hidden',
          )}
        />
      )}
      {children}
    </div>
  );
};
