import type { CSSProperties } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { getTextStyle } from './Text.styles';
import type { TextProps, TextVariant } from './Text.types';

const elements: Record<TextVariant, 'h1' | 'h2' | 'h3' | 'p' | 'span'> = {
  title: 'h1',
  heading: 'h2',
  subheading: 'h3',
  body: 'p',
  label: 'span',
  caption: 'span',
};

export function Text(props: TextProps) {
  const theme = useTheme();
  const Element = elements[props.variant ?? 'body'];
  const { lineHeight, ...base } = getTextStyle(props, theme);

  const style: CSSProperties = { margin: 0, ...base, lineHeight: `${lineHeight}px` };
  if (props.numberOfLines) {
    Object.assign(style, {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: props.numberOfLines,
      overflow: 'hidden',
    });
  }

  return (
    <Element data-testid={props.testID} style={style}>
      {props.children}
    </Element>
  );
}
