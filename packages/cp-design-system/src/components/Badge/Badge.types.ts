export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  children: string;
  /** Defaults to `'neutral'`. */
  tone?: BadgeTone;
  testID?: string;
}
