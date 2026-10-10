import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { fontWeightFor } from '../../theme/createTheme';
import { springTo, timeTo } from '../../motion/worklet.native';
import { checkMarkLayout, controlColors } from './Checkbox.tokens';
import type { CheckboxProps } from './Checkbox.types';
import { useCheckbox } from './useCheckbox';

export function Checkbox(input: CheckboxProps) {
  const { props, tokens: t, spring, checked, indeterminate, on, toggle } = useCheckbox(input);
  const [pressed, setPressed] = useState(false);
  const disabled = !!props.isDisabled;
  const colors = controlColors(t, {
    on,
    disabled,
    invalid: !!props.isInvalid,
    hovered: false,
    pressed,
  });
  const mark = checkMarkLayout(t.size, t.borderWidth);

  const fill = useSharedValue(colors.fill);
  const border = useSharedValue(colors.border);
  const scale = useSharedValue(1);
  const tick = useSharedValue(checked && !indeterminate ? 1 : 0);
  const dash = useSharedValue(indeterminate ? 1 : 0);

  useEffect(() => {
    fill.value = spring ? timeTo(colors.fill, { duration: 150 }) : colors.fill;
    border.value = spring ? timeTo(colors.border, { duration: 150 }) : colors.border;
  }, [colors.fill, colors.border, spring, fill, border]);

  useEffect(() => {
    const tickTo = checked && !indeterminate ? 1 : 0;
    const dashTo = indeterminate ? 1 : 0;
    tick.value = spring ? springTo(tickTo, spring) : tickTo;
    dash.value = spring ? springTo(dashTo, spring) : dashTo;
  }, [checked, indeterminate, spring, tick, dash]);

  useEffect(() => {
    const to = pressed ? t.pressedScale : 1;
    scale.value = spring ? springTo(to, spring) : 1;
  }, [pressed, spring, t.pressedScale, scale]);

  const boxStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      backgroundColor: fill.value,
      borderColor: border.value,
      transform: [{ scale: scale.value }],
    };
  });
  const tickStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: tick.value,
      transform: [{ rotate: '45deg' }, { scale: 0.3 + 0.7 * tick.value }],
    };
  });
  const dashStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: dash.value, transform: [{ scaleX: dash.value }] };
  });

  return (
    <Pressable
      testID={props.testID}
      accessibilityRole="checkbox"
      accessibilityLabel={props.label}
      accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}
      disabled={disabled}
      onPress={toggle}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: t.gap }}
    >
      <View
        style={{
          width: t.hitSize,
          height: Math.max(t.hitSize, t.lineHeight),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View
          testID={props.testID && `${props.testID}-box`}
          style={[
            {
              width: t.size,
              height: t.size,
              borderRadius: t.radius,
              borderWidth: t.borderWidth,
            },
            boxStyle,
          ]}
        >
          <Animated.View
            testID={props.testID && `${props.testID}-tick`}
            style={[
              {
                position: 'absolute',
                ...mark.tick,
                borderColor: colors.mark,
                borderRightWidth: mark.stroke,
                borderBottomWidth: mark.stroke,
              },
              tickStyle,
            ]}
          />
          <Animated.View
            testID={props.testID && `${props.testID}-dash`}
            style={[
              {
                position: 'absolute',
                ...mark.dash,
                borderRadius: mark.stroke,
                backgroundColor: colors.mark,
              },
              dashStyle,
            ]}
          />
        </Animated.View>
      </View>
      <Text
        style={{
          flexShrink: 1,
          paddingVertical: Math.max(0, (t.hitSize - t.lineHeight) / 2),
          color: disabled ? t.labelDisabled : t.label,
          fontSize: t.fontSize,
          lineHeight: t.lineHeight,
          fontFamily: t.fontFamily,
          fontWeight: fontWeightFor(400),
        }}
      >
        {props.label}
        {props.isRequired ? <Text style={{ color: t.required }}> *</Text> : null}
      </Text>
    </Pressable>
  );
}
