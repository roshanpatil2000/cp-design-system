import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated';
import { springTo, stopAnimation, timeTo } from '../../motion/worklet.native';
import { useComponent } from '../../theme/useComponent';
import { clampProgress, getProgressBarTokens, type ProgressBarProps } from './ProgressBar.types';

/** Atlassian's progress bar. The bar springs to new values; unknown progress shows a looping segment. */
export function ProgressBar(input: ProgressBarProps) {
  const {
    props,
    tokens: t,
    spring,
  } = useComponent('ProgressBar', input, getProgressBarTokens, 'gentle');
  const value = clampProgress(props.value);
  const indeterminate = !!props.isIndeterminate;
  const width = useSharedValue(0);
  const progress = useSharedValue(indeterminate ? 0 : value);
  const loop = useSharedValue(0);

  useEffect(() => {
    if (indeterminate) return;
    progress.value = spring ? springTo(value, spring) : value;
  }, [value, indeterminate, spring, progress]);

  useEffect(() => {
    if (!indeterminate || !spring) {
      stopAnimation(loop);
      loop.value = 0.5;
      return;
    }
    loop.value = 0;
    loop.value = withRepeat(
      timeTo(1, { duration: t.loopDuration, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
      -1,
    );
    return () => stopAnimation(loop);
  }, [indeterminate, spring, t.loopDuration, loop]);

  const segment = t.segment;
  const barStyle = useAnimatedStyle(() => {
    'worklet';
    if (indeterminate) {
      return {
        width: width.value * segment,
        transform: [
          { translateX: -width.value * segment + loop.value * width.value * (1 + segment) },
        ],
      };
    }
    return { width: width.value * progress.value, transform: [{ translateX: 0 }] };
  });

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={props.label}
      accessibilityValue={
        indeterminate ? undefined : { min: 0, max: 100, now: Math.round(value * 100) }
      }
      testID={props.testID}
      onLayout={(e) => {
        width.value = e.nativeEvent.layout.width;
      }}
      style={{
        width: '100%',
        height: t.height,
        borderRadius: t.radius,
        backgroundColor: t.track,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        testID={props.testID && `${props.testID}-bar`}
        style={[{ height: '100%', borderRadius: t.radius, backgroundColor: t.bar }, barStyle]}
      />
    </View>
  );
}
