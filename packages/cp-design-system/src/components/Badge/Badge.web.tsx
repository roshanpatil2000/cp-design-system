import { useTheme } from '../../theme/ThemeProvider';
import { getBadgeStyles } from './Badge.styles';
import type { BadgeProps } from './Badge.types';

export function Badge(props: BadgeProps) {
  const theme = useTheme();
  const { container, label } = getBadgeStyles(props, theme);
  return (
    <span
      data-testid={props.testID}
      style={{
        display: 'inline-flex',
        ...container,
        ...label,
        lineHeight: `${label.lineHeight}px`,
      }}
    >
      {props.children}
    </span>
  );
}
