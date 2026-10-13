import { useRef, useState } from 'react';
import { View } from 'react-native';
import { withoutUndefined } from '../../theme/component';
import { useTheme } from '../../theme/context';
import { ButtonBase } from '../Button/Button.native';
import { getButtonTokens } from '../Button/Button.tokens';
import { Icon } from '../Icon/Icon.native';
import { Menu } from '../internal/Menu.native';
import { joinedTokens, type SplitButtonProps } from './SplitButton.types';

/** A main action joined to a dropdown of related actions. */
export function SplitButton(input: SplitButtonProps) {
  const theme = useTheme();
  const props = {
    ...theme.components.SplitButton?.defaultProps,
    ...withoutUndefined(input),
  } as SplitButtonProps;
  const [open, setOpen] = useState(false);
  const groupRef = useRef<View>(null);
  const appearance = props.appearance ?? 'default';
  const spacing = props.spacing ?? 'default';
  const radius = getButtonTokens(theme, appearance, spacing, false).radius;
  const bordered = appearance === 'default';
  const compact = spacing === 'compact';

  return (
    <View
      ref={groupRef}
      testID={props.testID}
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        gap: bordered ? 0 : 1,
        borderRadius: radius,
        overflow: 'hidden',
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
      <View style={{ marginLeft: bordered ? -1 : 0 }}>
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
      </View>
      <Menu
        role="menu"
        isOpen={open}
        onClose={() => setOpen(false)}
        anchorRef={groupRef}
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
    </View>
  );
}
