import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated';
import { mixColors, stopAnimation, timeTo } from '../../motion/worklet.native';
import { useComponent } from '../../theme/useComponent';
import { getSkeletonTokens, skeletonRadius, type SkeletonProps } from './Skeleton.types';

/** A placeholder shape that pulses while content loads. Hidden from assistive tech. */
export function Skeleton(input: SkeletonProps) {
  const {
    theme,
    props,
    tokens: t,
    reduceMotion,
  } = useComponent('Skeleton', input, getSkeletonTokens);
  const pulse = (props.isShimmering ?? true) && !reduceMotion;
  const phase = useSharedValue(0);
  useEffect(() => {
    if (!pulse) {
      stopAnimation(phase);
      phase.value = 0;
      return;
    }
    phase.value = withRepeat(
      timeTo(1, { duration: t.pulseDuration / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    return () => stopAnimation(phase);
  }, [pulse, t.pulseDuration, phase]);
  const { color, colorSubtle } = t;
  const style = useAnimatedStyle(() => {
    'worklet';
    return { backgroundColor: mixColors(phase.value, [0, 1], [color, colorSubtle]) };
  });
  return (
    <Animated.View
      testID={props.testID}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width: props.width ?? '100%',
          height: props.height ?? 16,
          borderRadius: skeletonRadius(theme, props.borderRadius),
        },
        style,
      ]}
    />
  );
}
