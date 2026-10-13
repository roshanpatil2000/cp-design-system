import { useRef, useState } from 'react';
import { View } from 'react-native';
import { withoutUndefined } from '../../theme/component';
import { useTheme } from '../../theme/context';
import { ButtonBase } from '../Button/Button.native';
import { Icon } from '../Icon/Icon.native';
import { Menu } from '../internal/Menu.native';
import { runItem, toMenuOptions, type DropdownMenuProps } from './DropdownMenu.types';

/**
 * A button that opens a menu of actions, with optional sections, icons, descriptions and
 * checkbox items. Keyboard driven on web (arrows, Enter, Escape, typeahead).
 */
export function DropdownMenu(input: DropdownMenuProps) {
  const theme = useTheme();
  const props = {
    ...theme.components.DropdownMenu?.defaultProps,
    ...withoutUndefined(input),
  } as DropdownMenuProps;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<View>(null);
  const setOpenAndNotify = (next: boolean) => {
    setOpen(next);
    props.onOpenChange?.(next);
  };
  const triggerIcon = typeof props.trigger === 'string' ? undefined : props.trigger.icon;
  const iconTrigger = triggerIcon !== undefined;
  const label = typeof props.trigger === 'string' ? props.trigger : props.trigger.label;
  const compact = props.spacing === 'compact';

  return (
    <View
      ref={anchorRef}
      testID={props.testID}
      collapsable={false}
      style={{ alignSelf: 'flex-start' }}
    >
      <ButtonBase
        appearance={props.appearance}
        spacing={props.spacing}
        isDisabled={props.isDisabled}
        motion={props.motion}
        hasPopup="menu"
        isExpanded={open}
        isSelected={open || undefined}
        accessibilityLabel={iconTrigger ? label : undefined}
        onPress={() => setOpenAndNotify(!open)}
        tokens={iconTrigger ? { paddingX: compact ? 6 : 8 } : undefined}
        testID={props.testID && `${props.testID}-trigger`}
        iconBefore={
          triggerIcon
            ? ({ color, size }) => <Icon glyph={triggerIcon} size={size} color={color} />
            : undefined
        }
        iconAfter={
          iconTrigger
            ? undefined
            : ({ color, size }) => <Icon glyph="chevron-down" size={size} color={color} />
        }
      >
        {iconTrigger ? undefined : label}
      </ButtonBase>
      <Menu
        role="menu"
        isOpen={open}
        onClose={() => setOpenAndNotify(false)}
        anchorRef={anchorRef}
        placement={props.placement}
        label={label}
        options={toMenuOptions(props.items)}
        onSelect={(v) => runItem(props.items, v)}
        testID={props.testID && `${props.testID}-menu`}
      />
    </View>
  );
}
