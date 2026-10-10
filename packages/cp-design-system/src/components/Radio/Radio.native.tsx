import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { fontWeightFor } from '../../theme/createTheme';
import { springTo, timeTo } from '../../motion/worklet.native';
import { controlColors } from '../Checkbox/Checkbox.tokens';
import type { RadioGroupProps, RadioProps } from './Radio.types';
import { useRadio, useRadioGroup } from './useRadio';

export function Radio(input: RadioProps) {
  const { props, tokens: t, spring, checked, select } = useRadio(input);
  const [pressed, setPressed] = useState(false);
  const disabled = !!props.isDisabled;
  const colors = controlColors(t, {
    on: checked,
    disabled,
    invalid: !!props.isInvalid,
    hovered: false,
    pressed,
  });

  const fill = useSharedValue(colors.fill);
  const border = useSharedValue(colors.border);
  const scale = useSharedValue(1);
  const dot = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    fill.value = spring ? timeTo(colors.fill, { duration: 150 }) : colors.fill;
    border.value = spring ? timeTo(colors.border, { duration: 150 }) : colors.border;
  }, [colors.fill, colors.border, spring, fill, border]);
  useEffect(() => {
    dot.value = spring ? springTo(checked ? 1 : 0, spring) : checked ? 1 : 0;
  }, [checked, spring, dot]);
  useEffect(() => {
    scale.value = spring ? springTo(pressed ? t.pressedScale : 1, spring) : 1;
  }, [pressed, spring, t.pressedScale, scale]);

  const circleStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      backgroundColor: fill.value,
      borderColor: border.value,
      transform: [{ scale: scale.value }],
    };
  });
  const dotStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: dot.value, transform: [{ scale: dot.value }] };
  });

  return (
    <Pressable
      testID={props.testID}
      accessibilityRole="radio"
      accessibilityLabel={props.label}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={select}
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
          testID={props.testID && `${props.testID}-circle`}
          style={[
            {
              width: t.size,
              height: t.size,
              borderRadius: t.size / 2,
              borderWidth: t.borderWidth,
              alignItems: 'center',
              justifyContent: 'center',
            },
            circleStyle,
          ]}
        >
          <Animated.View
            testID={props.testID && `${props.testID}-dot`}
            style={[
              {
                width: t.dotSize,
                height: t.dotSize,
                borderRadius: t.dotSize / 2,
                backgroundColor: colors.mark,
              },
              dotStyle,
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

export function RadioGroup(input: RadioGroupProps) {
  const { props, value, select } = useRadioGroup(input);
  const horizontal = props.direction === 'horizontal';
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={props.label}
      testID={props.testID}
      style={{
        flexDirection: horizontal ? 'row' : 'column',
        flexWrap: horizontal ? 'wrap' : 'nowrap',
        columnGap: 16,
      }}
    >
      {props.options.map((o) => (
        <Radio
          key={o.value}
          label={o.label}
          value={o.value}
          isChecked={value === o.value}
          isDisabled={props.isDisabled || o.isDisabled}
          isInvalid={props.isInvalid}
          tokens={props.tokens}
          motion={props.motion}
          onChange={select}
          testID={props.testID && `${props.testID}-${o.value}`}
        />
      ))}
    </View>
  );
}
