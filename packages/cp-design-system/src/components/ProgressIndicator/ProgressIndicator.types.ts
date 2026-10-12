import type { MotionOverride, Theme } from '../../theme/types';

export type ProgressIndicatorAppearance = 'default' | 'primary' | 'help' | 'inverted';

export interface ProgressIndicatorProps {
  /** Number of steps (dots). */
  count: number;
  /** Zero-based index of the current step. */
  selectedIndex: number;
  /** Makes the dots buttons that jump to a step. */
  onSelect?: (index: number) => void;
  /** Defaults to `'default'`. */
  appearance?: ProgressIndicatorAppearance;
  /** `'default'` 8px dots, `'large'` 12px. */
  size?: 'default' | 'large';
  /** Gap between dots. Defaults to `'comfortable'`. */
  spacing?: 'comfortable' | 'cozy' | 'compact';
  /** Accessible name of each dot, from its index. Defaults to `Step 2 of 5`. */
  stepLabel?: (index: number, count: number) => string;
  tokens?: Partial<ProgressIndicatorTokens>;
  motion?: MotionOverride;
  testID?: string;
}

export interface ProgressIndicatorTokens {
  dotSize: number;
  gap: number;
  /** How much wider the selected dot grows (1 = a plain dot). */
  selectedStretch: number;
  dot: string;
  selected: string;
  focusRing: string;
}

export function getProgressIndicatorTokens(
  theme: Theme,
  p: ProgressIndicatorProps,
): ProgressIndicatorTokens {
  const c = theme.color;
  const selected = {
    default: c['color.background.neutral.bold'],
    primary: c['color.background.brand.bold'],
    help: c['color.background.discovery.bold'],
    inverted: c['color.icon.inverse'],
  }[p.appearance ?? 'default'];
  const dotSize = p.size === 'large' ? 12 : 8;
  return {
    dotSize,
    gap: { comfortable: dotSize, cozy: dotSize / 2, compact: dotSize / 4 }[
      p.spacing ?? 'comfortable'
    ],
    selectedStretch: 2.5,
    dot:
      p.appearance === 'inverted'
        ? c['color.background.inverse.subtle']
        : c['color.background.neutral'],
    selected,
    focusRing: c['color.border.focused'],
  };
}

export const defaultStepLabel = (i: number, count: number) => `Step ${i + 1} of ${count}`;
