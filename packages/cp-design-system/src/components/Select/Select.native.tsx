import { useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { springTo } from '../../motion/worklet.native';
import { Icon } from '../Icon/Icon.native';
import { FieldLabel } from '../internal/FieldLabel.native';
import { FieldMessage } from '../internal/FieldMessage.native';
import { Menu } from '../internal/Menu.native';
import { messageStyleOf } from '../internal/fieldLabelStyle';
import type { SelectProps } from './Select.types';
import { useSelect } from './useSelect';

/** Pick one option from a dropdown list, styled like a TextField. */
export function Select(input: SelectProps) {
  const s = useSelect(input, true);
  const { props, tokens: t, spring } = s;
  const triggerRef = useRef<View>(null);
  const turn = useSharedValue(0);
  useEffect(() => {
    turn.value = spring ? springTo(s.open ? 1 : 0, spring) : s.open ? 1 : 0;
  }, [s.open, spring, turn]);
  const chevron = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ rotate: `${turn.value * 180}deg` }] };
  });
  const active = s.open;
  const border = props.isInvalid
    ? t.borderInvalid
    : active
      ? t.borderFocused
      : s.disabled
        ? t.borderDisabled
        : t.border;

  return (
    <View testID={props.testID} style={{ width: '100%', maxWidth: props.width }}>
      {props.label ? <FieldLabel label={props.label} isRequired={props.isRequired} t={t} /> : null}
      <Pressable
        ref={triggerRef}
        testID={props.testID && `${props.testID}-trigger`}
        accessibilityRole="button"
        accessibilityLabel={[props.label, s.selected?.label ?? s.placeholder]
          .filter(Boolean)
          .join(', ')}
        accessibilityHint="Opens a list of options"
        accessibilityState={{ disabled: s.disabled, expanded: s.open }}
        disabled={s.disabled}
        onPress={() => s.setOpen(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          height: t.height,
          paddingLeft: t.paddingX + 2,
          paddingRight: t.paddingX,
          borderWidth: active ? t.borderWidth + 1 : t.borderWidth,
          borderColor: border,
          borderRadius: t.radius,
          backgroundColor: s.disabled
            ? t.backgroundDisabled
            : active
              ? t.backgroundFocused
              : t.background,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            color: s.disabled ? t.textDisabled : s.selected ? t.text : t.placeholder,
            fontFamily: t.fontFamily,
            fontSize: t.fontSize,
            lineHeight: t.lineHeight,
          }}
        >
          {s.selected?.label ?? s.placeholder}
        </Text>
        <Animated.View style={chevron}>
          <Icon
            glyph="chevron-down"
            size="medium"
            color={s.disabled ? t.textDisabled : 'color.icon.subtle'}
          />
        </Animated.View>
      </Pressable>
      <FieldMessage message={s.message} testID={props.testID} style={messageStyleOf(t)} />
      <Menu
        role="listbox"
        isOpen={s.open}
        onClose={() => s.setOpen(false)}
        onSelect={s.select}
        options={props.options}
        selectedValue={s.value}
        anchorRef={triggerRef}
        label={props.label}
        testID={props.testID && `${props.testID}-options`}
      />
    </View>
  );
}
