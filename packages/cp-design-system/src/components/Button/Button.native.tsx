import { useEffect, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { fontWeightFor } from '../../theme/createTheme';
import { mixColors, springTo } from '../../motion/worklet.native';
import { Spinner } from '../Spinner/Spinner.native';
import type { ButtonProps } from './Button.types';
import { useButton } from './useButton';

/** Minimum touch target (pt), reached with hit slop so the visual size stays Atlassian's. */
const MIN_TARGET = 44;

export function Button(input: ButtonProps) {
  const b = useButton(input);
  const { props, tokens: t, spring, reduceMotion, interactive } = b;

  // 0 = released, 1 = pressed. Drives both the pressed color and the scale.
  const pressed = useSharedValue(0);
  const loading = useSharedValue(b.isLoading ? 1 : 0);
  const scaleAmount = spring ? 1 - t.pressScale : 0;

  useEffect(() => {
    loading.value = reduceMotion
      ? b.isLoading
        ? 1
        : 0
      : withTiming(b.isLoading ? 1 : 0, { duration: 150 });
  }, [b.isLoading, reduceMotion, loading]);

  const pressTo = (value: number) => {
    pressed.value = spring ? springTo(value, spring) : value;
  };

  const base = b.background;
  const pressedColor = interactive ? t.backgroundPressed : b.background;
  const containerStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      backgroundColor: mixColors(pressed.value, [0, 1], [base, pressedColor]),
      transform: [{ scale: 1 - scaleAmount * pressed.value }],
    };
  });
  const contentStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: 1 - loading.value,
      transform: [{ scale: 1 - 0.08 * loading.value }],
    };
  });
  const spinnerStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: loading.value, transform: [{ scale: 0.6 + 0.4 * loading.value }] };
  });

  const slop = Math.max(0, (MIN_TARGET - t.height) / 2);
  const label: ReactNode =
    typeof props.children === 'string' || typeof props.children === 'number' ? (
      <Text
        numberOfLines={1}
        style={{
          color: b.textColor,
          fontSize: t.fontSize,
          lineHeight: t.lineHeight,
          fontWeight: fontWeightFor(t.fontWeight),
          fontFamily: t.fontFamily,
          flexShrink: 1,
        }}
      >
        {props.children}
      </Text>
    ) : (
      props.children
    );

  return (
    <Pressable
      testID={props.testID}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      accessibilityState={{
        disabled: b.isDisabled || b.isLoading,
        busy: b.isLoading,
        selected: props.isSelected === undefined ? undefined : b.isSelected,
      }}
      disabled={!interactive}
      hitSlop={{ top: slop, bottom: slop }}
      onPressIn={() => interactive && pressTo(1)}
      onPressOut={() => pressTo(0)}
      onPress={b.press}
      style={{ alignSelf: props.shouldFitContainer ? 'stretch' : 'flex-start', maxWidth: '100%' }}
    >
      <Animated.View
        style={[
          {
            height: t.height,
            paddingHorizontal: t.paddingX,
            borderRadius: t.radius,
            borderWidth: b.borderColor === 'transparent' ? 0 : t.borderWidth,
            borderColor: b.borderColor,
            alignItems: 'center',
            justifyContent: 'center',
          },
          containerStyle,
        ]}
      >
        <Animated.View
          style={[{ flexDirection: 'row', alignItems: 'center', gap: t.gap }, contentStyle]}
        >
          {props.iconBefore ? <View>{b.renderIcon(props.iconBefore)}</View> : null}
          {label}
          {props.iconAfter ? <View>{b.renderIcon(props.iconAfter)}</View> : null}
        </Animated.View>
        {b.isLoading ? (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
              },
              spinnerStyle,
            ]}
          >
            <Spinner
              size={t.spinnerSize}
              color={b.textColor}
              testID={props.testID && `${props.testID}-spinner`}
            />
          </Animated.View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}
