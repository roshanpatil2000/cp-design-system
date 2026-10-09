import type { Theme } from '../../theme/themes';
import type { InputProps } from './Input.types';

export function getInputStyles(props: InputProps, theme: Theme, focused: boolean) {
  const { colors, spacing, fontSizes, lineHeights, fontWeights, radii } = theme;
  const borderColor = props.error ? colors.danger : focused ? colors.primary : colors.border;

  return {
    field: {
      color: colors.text,
      backgroundColor: props.disabled ? colors.surfaceMuted : colors.surface,
      fontSize: fontSizes.md,
      paddingLeft: spacing[3],
      paddingRight: spacing[3],
      paddingTop: spacing[2],
      paddingBottom: spacing[2],
      borderRadius: radii.md,
      borderWidth: 1,
      borderStyle: 'solid' as const,
      borderColor,
      opacity: props.disabled ? 0.6 : 1,
    },
    label: {
      color: colors.text,
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.sm,
      fontWeight: fontWeights.medium,
      marginBottom: spacing[1],
    },
    helper: {
      color: props.error ? colors.danger : colors.textMuted,
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.xs,
      marginTop: spacing[1],
    },
    placeholderColor: colors.textMuted,
  };
}
