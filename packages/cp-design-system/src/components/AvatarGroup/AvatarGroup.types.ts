import type { AvatarPresence, AvatarSize } from '../Avatar/Avatar.types';

export interface AvatarGroupItem {
  name: string;
  src?: string;
  presence?: AvatarPresence;
  onPress?: () => void;
  /** React key; defaults to the name. */
  key?: string;
}

export interface AvatarGroupProps {
  data: AvatarGroupItem[];
  /** Defaults to `'medium'`. */
  size?: AvatarSize;
  /** `'stack'` overlaps avatars; `'grid'` lays them out with gaps. Defaults to `'stack'`. */
  appearance?: 'stack' | 'grid';
  /** Avatars shown before the "+N" button. Defaults to 5. */
  maxCount?: number;
  /** Called by the "+N" button. When left out, the button expands the group to show everyone. */
  onMorePress?: () => void;
  /** Accessible name of the group. Defaults to `'People'`. */
  label?: string;
  testID?: string;
}

/** How much stacked avatars overlap, as a fraction of their size. */
export const STACK_OVERLAP = 0.25;

export function splitGroup(data: AvatarGroupItem[], maxCount: number, expanded: boolean) {
  if (expanded || data.length <= maxCount) return { shown: data, hidden: 0 };
  // Reserve one slot for the "+N" button.
  const shown = data.slice(0, Math.max(1, maxCount - 1));
  return { shown, hidden: data.length - shown.length };
}
