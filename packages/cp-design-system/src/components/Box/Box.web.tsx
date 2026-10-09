import { useTheme } from '../../theme/ThemeProvider';
import { getBoxStyle } from './Box.styles';
import type { BoxProps } from './Box.types';

export function Box(props: BoxProps) {
  const theme = useTheme();
  return (
    <div
      data-testid={props.testID}
      style={{
        display: 'flex',
        boxSizing: 'border-box',
        minWidth: 0,
        ...getBoxStyle(props, theme),
      }}
    >
      {props.children}
    </div>
  );
}
