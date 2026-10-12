import { useEffect, useState } from 'react';
import { Pressable as RNPressable, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { springTo, timeTo } from '../../motion/worklet.native';
import { useComponent } from '../../theme/useComponent';
import {
  getPressableTokens,
  pressableBackground,
  type PressableProps,
  type PressableState,
} from './Pressable.types';

/**
 * An unstyled pressable with the system's press treatment: a background that follows the touch
 * and a spring squish. Build custom tappable cards, rows and icon buttons on it.
 */
export function Pressable(input: PressableProps) {
  const { theme, props, tokens: t, spring } = useComponent('Pressable', input, getPressableTokens);
  const [pressed, setPressed] = useState(false);
  const disabled = !!props.isDisabled;
  const state: PressableState = { hovered: false, pressed: pressed && !disabled, focused: false };
  const bg = pressableBackground(t, state);

  const scale = useSharedValue(1);
  const fill = useSharedValue(bg);
  useEffect(() => {
    const to = state.pressed ? t.pressedScale : 1;
    scale.value = spring ? springTo(to, spring) : to;
  }, [state.pressed, spring, t.pressedScale, scale]);
  useEffect(() => {
    fill.value = spring ? timeTo(bg, { duration: 150 }) : bg;
  }, [bg, spring, fill]);

  const animated = useAnimatedStyle(() => {
    'worklet';
    return { backgroundColor: fill.value, transform: [{ scale: scale.value }] };
  });
  const content = typeof props.children === 'function' ? props.children(state) : props.children;

  return (
    <RNPressable
      testID={props.testID}
      accessibilityRole={props.role ?? 'button'}
      accessibilityLabel={props.accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={props.onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <Animated.View
        testID={props.testID && `${props.testID}-surface`}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            padding: props.padding ? theme.space[props.padding] : 0,
            borderRadius: t.radius,
            opacity: disabled ? t.disabledOpacity : 1,
            ...(props.style as ViewStyle),
          },
          animated,
        ]}
      >
        {content}
      </Animated.View>
    </RNPressable>
  );
}
