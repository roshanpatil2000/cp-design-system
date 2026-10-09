import type { Theme } from '../../theme/themes';
import type { CardProps } from './Card.types';

export function getCardStyle(props: CardProps, theme: Theme) {
  const pad = theme.spacing[props.padding ?? 4];
  return {
    flexDirection: 'column' as const,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderStyle: 'solid' as const,
    borderRadius: theme.radii.lg,
    paddingTop: pad,
    paddingBottom: pad,
    paddingLeft: pad,
    paddingRight: pad,
  };
}

/** One shadow definition, expressed for each platform. */
export const cardShadow = {
  web: '0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.06)',
  native: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
};
