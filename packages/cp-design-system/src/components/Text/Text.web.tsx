import { createElement, type CSSProperties } from 'react';
import { useTheme } from '../../theme/context';
import { textStyle, type TextProps } from './Text.types';

/** Body text in Atlassian's type scale and theme colors. */
export function Text(props: TextProps) {
  const theme = useTheme();
  const s = textStyle(theme, props);
  const clamp: CSSProperties = props.maxLines
    ? props.maxLines === 1
      ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }
      : {
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: props.maxLines,
        }
    : {};
  return createElement(
    props.as ?? 'span',
    {
      'data-testid': props.testID,
      style: {
        margin: 0,
        ...s,
        fontFamily: s.fontFamily ?? 'inherit',
        lineHeight: `${s.lineHeight}px`,
        ...clamp,
      } as CSSProperties,
    },
    props.children,
  );
}
