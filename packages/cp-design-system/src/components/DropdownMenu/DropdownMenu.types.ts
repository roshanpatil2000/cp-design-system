import type { MotionOverride } from '../../theme/types';
import type { ButtonAppearance, ButtonSpacing } from '../Button/Button.types';
import type { IconGlyph } from '../Icon/Icon.types';
import type { Placement } from '../internal/placement';

export interface DropdownMenuItem {
  label: string;
  onPress?: () => void;
  description?: string;
  icon?: IconGlyph;
  isDisabled?: boolean;
  /** Makes it a checkbox item. The menu stays open so several can be toggled. */
  isChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Section title; consecutive items with the same group are listed under it. */
  group?: string;
}

export interface DropdownMenuProps {
  /** Button label, or an icon-only trigger with an accessible label. */
  trigger: string | { icon: IconGlyph; label: string };
  items: DropdownMenuItem[];
  /** Trigger appearance. Defaults to `'default'`. */
  appearance?: ButtonAppearance;
  spacing?: ButtonSpacing;
  /** Defaults to `'bottom-start'`. */
  placement?: Placement;
  isDisabled?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  motion?: MotionOverride;
  testID?: string;
}

export const toMenuOptions = (items: DropdownMenuItem[]) =>
  items.map((item, i) => ({
    value: String(i),
    label: item.label,
    description: item.description,
    icon: item.icon,
    isDisabled: item.isDisabled,
    isChecked: item.isChecked,
    group: item.group,
  }));

export function runItem(items: DropdownMenuItem[], value: string) {
  const item = items[Number(value)];
  if (!item) return;
  if (item.isChecked !== undefined) item.onCheckedChange?.(!item.isChecked);
  item.onPress?.();
}
