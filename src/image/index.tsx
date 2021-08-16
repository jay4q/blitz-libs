import './index.css';
import React, {
  ImgHTMLAttributes,
  useCallback,
  useRef,
  useMemo,
  useState,
  FunctionComponent,
} from 'react';
import mediumZoom from 'medium-zoom';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import qs from 'query-string';
import { useNativeLazyLoading } from './helper';
import { BlurImage } from '../blur';

const ZOOM = mediumZoom();

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
   * @default true
   */
  zoomable?: boolean;

  /**
   * @description 图片宽高比
   */
  ratio?: number;
};

export const Image: FunctionComponent<ImageProps> = ({
  onLoad,
  onClick,
  style,
  className,
  hash: _hash,
  color: _color,
  ratio: _ratio,
  zoomable = true,
  ...restProps
}) => {
  const zoomRef = useRef(ZOOM.clone({ background: 'white' }));

  const supportsLazyLoading = useNativeLazyLoading();
  const { ref, inView } = useInView({
    triggerOnce: true,
    skip: supportsLazyLoading !== false,
  });

  const [isLoaded, setImageLoaded] = useState(false);
  const [delayLoaded, setDelayLoaded] = useState(false);

  const { hash, color, ratio } = useMemo(() => {
    try {
      if (!restProps.src) throw new Error();

      // 解析链接中的参数
      const arr = restProps.src.split('?');
      if (arr.length !== 2) throw new Error();

      // const search_result = /(?<=\?).{1,}/.exec(restProps.src)
      // if (!search_result) throw new Error()
      // const search = qs.parse(search_result[0])

      const search = qs.parse(arr[1]);
      return {
        hash: (search['hash'] as string) || _hash,
        color: (search['color'] as string) || _color,
        ratio: Number(search['width']) / Number(search['height']) || _ratio,
      };
    } catch (err) {
      return {
        hash: _hash,
        color: _color,
        ratio: _ratio,
      };
    }
  }, [_hash, _color, _ratio, restProps.src]);

  /**
   * 兼容图片缩放模式
   */
  const attachZoom = useCallback(
    (ref) => {
      if (zoomable) {
        zoomRef.current.attach(ref);
      } else {
        zoomRef.current.detach(ref);
      }
    },
    [zoomable],
  );

  /**
   * 图片加载回调
   */
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
        }, 500);
      }
    },
    [color, hash, onLoad],
  );

  /**
   * 图片点击事件
   */
  const onImageClick = useCallback(
    (e: any) => {
      if (!zoomable && onClick) {
        onClick(e);
      }
    },
    [zoomable, onClick],
  );

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
      {(inView || supportsLazyLoading) && (
        <img
          alt="img"
          {...restProps}
          ref={attachZoom}
          loading="lazy"
          className="bl-image__img"
          onLoad={onImageLoad}
        />
      )}
      {!hash && color && !delayLoaded && (
        <div
          style={{ background: color }}
          className={classNames(
            'bl-image__ph',
            isLoaded && 'bl-image__ph--hidden',
          )}
        ></div>
      )}
      {hash && !delayLoaded && (
        <BlurImage
          hash={hash}
          className={classNames(
            'bl-image__ph',
            isLoaded && 'bl-image__ph--hidden',
          )}
        />
      )}
    </div>
  );
};