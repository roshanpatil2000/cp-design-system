import { Children, Fragment, isValidElement } from 'react';
import { Text } from 'react-native';
import { Box } from '../Box/Box.native';
import { useTheme } from '../../theme/context';
import { inlineStyle, stackStyle, type InlineProps, type StackProps } from './Stack.types';

/** Lays children out in a column with a token gap. */
export function Stack({ children, space, alignInline, grow, style, ...box }: StackProps) {
  const theme = useTheme();
  return (
    <Box {...box} style={{ ...stackStyle(theme, { space, alignInline, grow }), ...style }}>
      {children}
    </Box>
  );
}

/** Lays children out in a row with a token gap, optionally wrapping and with separators. */
export function Inline({
  children,
  space,
  rowSpace,
  alignBlock,
  alignInline,
  spread,
  shouldWrap,
  separator,
  style,
  ...box
}: InlineProps) {
  const theme = useTheme();
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <Box
      {...box}
      style={{
        ...inlineStyle(theme, { space, rowSpace, alignBlock, alignInline, spread, shouldWrap }),
        ...style,
      }}
    >
      {separator === undefined
        ? children
        : items.map((child, i) => (
            <Fragment key={child.key ?? i}>
              {i > 0 ? (
                typeof separator === 'string' ? (
                  <Text style={{ color: theme.color['color.text.subtlest'] }}>{separator}</Text>
                ) : (
                  separator
                )
              ) : null}
              {child}
            </Fragment>
          ))}
    </Box>
  );
}
