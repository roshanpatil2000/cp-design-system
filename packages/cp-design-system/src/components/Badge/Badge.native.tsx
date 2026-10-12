import { useEffect, useRef } from 'react';
import { Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { springTo } from '../../motion/worklet.native';
import { fontWeightFor } from '../../theme/createTheme';
import { useComponent } from '../../theme/useComponent';
import { badgeText, getBadgeTokens, type BadgeProps } from './Badge.types';

/** A count, e.g. unread notifications. It pops when the value changes. */
export function Badge(input: BadgeProps) {
  const { props, tokens: t, spring } = useComponent('Badge', input, getBadgeTokens, 'bouncy');
  const text = badgeText(props.children, props.max, props.appearance === 'added');
  const scale = useSharedValue(1);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!spring || t.popScale === 1) return;
    scale.value = t.popScale;
    scale.value = springTo(1, spring);
  }, [text, spring, t.popScale, scale]);
  const style = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: scale.value }] };
  });
  return (
    <Animated.View
      testID={props.testID}
      style={[
        {
          alignSelf: 'flex-start',
          minWidth: t.minWidth,
          paddingHorizontal: t.paddingX,
          borderRadius: t.radius,
          backgroundColor: t.background,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: t.text,
          fontFamily: t.fontFamily,
          fontSize: t.fontSize,
          lineHeight: t.lineHeight,
          fontWeight: fontWeightFor(t.fontWeight),
          textAlign: 'center',
          fontVariant: ['tabular-nums'],
        }}
      >
        {text}
      </Text>
    </Animated.View>
  );
}
