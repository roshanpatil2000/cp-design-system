import { createElement, type CSSProperties } from 'react';
import { useTheme } from '../../theme/context';
import { boxStyle, type BoxProps } from './Box.types';

/** A themed container: spacing, color, border and radius from tokens. */
export function Box(props: BoxProps) {
  const theme = useTheme();
  return createElement(
    props.as ?? 'div',
    {
      'data-testid': props.testID,
      style: {
        boxSizing: 'border-box',
        ...boxStyle(theme, props),
        ...props.style,
      } as CSSProperties,
    },
    props.children,
  );
}
