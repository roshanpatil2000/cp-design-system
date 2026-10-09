import type { SpacingToken } from '../../tokens';
import type { Theme } from '../../theme/themes';
import type { ButtonProps, ButtonSize } from './Button.types';

const sizes: Record<ButtonSize, { px: SpacingToken; py: SpacingToken; font: 'sm' | 'md' | 'lg' }> =
  {
    sm: { px: 3, py: 1, font: 'sm' },
    md: { px: 4, py: 2, font: 'md' },
    lg: { px: 5, py: 3, font: 'lg' },
  };

export interface ButtonStyles {
  container: {
    flexDirection: 'row';
    alignItems: 'center';
    justifyContent: 'center';
    alignSelf?: 'stretch' | 'flex-start';
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;
    borderRadius: number;
    borderWidth: number;
    borderStyle: 'solid';
    borderColor: string;
    backgroundColor: string;
    opacity: number;
  };
  label: {
    color: string;
    fontSize: number;
    lineHeight: number;
    fontWeight: Theme['fontWeights']['semibold'];
  };
}

/** Platform-neutral button styles; each renderer applies them to its own primitives. */
export function getButtonStyles(props: ButtonProps, theme: Theme, pressed = false): ButtonStyles {
  const { variant = 'solid', tone = 'primary', size = 'md', disabled, fullWidth } = props;
  const color = theme.colors[tone];
  const sz = sizes[size];
  const { spacing } = theme;

  return {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      paddingLeft: spacing[sz.px],
      paddingRight: spacing[sz.px],
      paddingTop: spacing[sz.py],
      paddingBottom: spacing[sz.py],
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: variant === 'ghost' ? 'transparent' : color,
      backgroundColor: variant === 'solid' ? color : 'transparent',
      opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
    },
    label: {
      color: variant === 'solid' ? theme.colors.primaryText : color,
      fontSize: theme.fontSizes[sz.font],
      lineHeight: theme.lineHeights[sz.font],
      fontWeight: theme.fontWeights.semibold,
    },
  };
}
