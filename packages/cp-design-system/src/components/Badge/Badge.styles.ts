import type { Theme, ThemeColor } from '../../theme/themes';
import type { BadgeProps, BadgeTone } from './Badge.types';

const tones: Record<BadgeTone, { bg: ThemeColor; fg: ThemeColor }> = {
  neutral: { bg: 'surfaceMuted', fg: 'textMuted' },
  primary: { bg: 'primarySubtle', fg: 'primary' },
  success: { bg: 'successSubtle', fg: 'success' },
  warning: { bg: 'warningSubtle', fg: 'warning' },
  danger: { bg: 'dangerSubtle', fg: 'danger' },
};

export function getBadgeStyles(props: BadgeProps, theme: Theme) {
  const tone = tones[props.tone ?? 'neutral'];
  return {
    container: {
      alignSelf: 'flex-start' as const,
      backgroundColor: theme.colors[tone.bg],
      borderRadius: theme.radii.full,
      paddingLeft: theme.spacing[2],
      paddingRight: theme.spacing[2],
      paddingTop: 2,
      paddingBottom: 2,
    },
    label: {
      color: theme.colors[tone.fg],
      fontSize: theme.fontSizes.xs,
      lineHeight: theme.lineHeights.xs,
      fontWeight: theme.fontWeights.semibold,
    },
  };
}
