import { CSSProperties } from 'react';

/**
 * @description 解决子节点在进行透明度变化时，忽略父节点 overflow:hidden 和圆角的问题
 * @see https://stackoverflow.com/questions/42297303/css-opacity-transition-ignoring-overflowhidden-in-chrome-safari
 */
export const fixOpacityIgnoreHiddenStyle: CSSProperties = {
  backfaceVisibility: 'hidden',
  transform: 'translate3d(0, 0, 0)',
};
