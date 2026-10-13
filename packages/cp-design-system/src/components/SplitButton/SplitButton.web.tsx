import { useRef, useState } from 'react';
import { withoutUndefined } from '../../theme/component';
import { useTheme } from '../../theme/context';
import { ButtonBase } from '../Button/Button.web';
import { getButtonTokens } from '../Button/Button.tokens';
import { Icon } from '../Icon/Icon.web';
import { Menu } from '../internal/Menu.web';
import { joinedTokens, type SplitButtonProps } from './SplitButton.types';

/** A main action joined to a dropdown of related actions. */
export function SplitButton(input: SplitButtonProps) {
  const theme = useTheme();
  const props = {
    ...theme.components.SplitButton?.defaultProps,
    ...withoutUndefined(input),
  } as SplitButtonProps;
  const [open, setOpen] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const appearance = props.appearance ?? 'default';
  const spacing = props.spacing ?? 'default';
  const radius = getButtonTokens(theme, appearance, spacing, false).radius;
  const bordered = appearance === 'default';
  const compact = spacing === 'compact';

  return (
    <div
      ref={groupRef}
      role="group"
      data-testid={props.testID}
      style={{
        display: 'inline-flex',
        gap: bordered ? 0 : 1,
        borderRadius: radius,
        overflow: 'hidden',
        verticalAlign: 'middle',
      }}
    >
      <ButtonBase
        appearance={appearance}
        spacing={spacing}
        isDisabled={props.isDisabled}
        isLoading={props.isLoading}
        motion={props.motion}
        onPress={props.onPress}
        tokens={joinedTokens}
      >
        {props.children}
      </ButtonBase>
      <div ref={triggerRef} style={{ display: 'flex', marginLeft: bordered ? -1 : 0 }}>
        <ButtonBase
          appearance={appearance}
          spacing={spacing}
          isDisabled={props.isDisabled}
          motion={props.motion}
          accessibilityLabel={props.menuLabel ?? 'More actions'}
          hasPopup="menu"
          isExpanded={open}
          onPress={() => setOpen((v) => !v)}
          tokens={{ ...joinedTokens, paddingX: compact ? 4 : 8 }}
          iconBefore={({ color, size }) => <Icon glyph="chevron-down" size={size} color={color} />}
          testID={props.testID && `${props.testID}-menu`}
        />
      </div>
      <Menu
        role="menu"
        isOpen={open}
        onClose={() => setOpen(false)}
        anchorRef={groupRef}
        returnFocusRef={triggerRef}
        alignEnd
        label={props.menuLabel ?? 'More actions'}
        options={props.items.map((item, i) => ({
          value: String(i),
          label: item.label,
          isDisabled: item.isDisabled,
        }))}
        onSelect={(v) => props.items[Number(v)]?.onPress()}
        testID={props.testID && `${props.testID}-items`}
      />
    </div>
  );
}
