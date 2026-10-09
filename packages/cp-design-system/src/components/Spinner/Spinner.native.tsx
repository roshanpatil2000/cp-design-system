import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { stopAnimation } from '../../motion/worklet.native';

export interface SpinnerProps {
  size: number;
  color: string;
  testID?: string;
}

/**
 * A rotating three-quarter ring. Internal for now (used by Button); it becomes a public component
 * with its own tokens later. It keeps spinning with reduced motion because it conveys "busy".
 */
export function Spinner({ size, color, testID }: SpinnerProps) {
  const stroke = Math.max(1.5, size / 8);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 800, easing: Easing.linear }), -1);
    return () => stopAnimation(rotation);
  }, [rotation]);

  const style = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ rotate: `${rotation.value}deg` }] };
  });

  return (
    <Animated.View
      testID={testID}
      accessible={false}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: color,
          borderTopColor: 'transparent',
        },
        style,
      ]}
    />
  );
}
