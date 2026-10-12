import { createElement, type CSSProperties } from 'react';
import { useTheme } from '../../theme/context';
import { headingLevel, headingStyle, type HeadingProps } from './Heading.types';

/** A heading in Atlassian's type scale. The HTML level follows the size unless you set `as`. */
export function Heading(props: HeadingProps) {
  const theme = useTheme();
  const s = headingStyle(theme, props);
  const clamp: CSSProperties = props.maxLines
    ? {
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: props.maxLines,
      }
    : {};
  return createElement(
    props.as ?? headingLevel[props.size ?? 'medium'],
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
