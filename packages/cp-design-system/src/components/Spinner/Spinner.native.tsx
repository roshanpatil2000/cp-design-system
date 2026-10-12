import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { stopAnimation } from '../../motion/worklet.native';
import { useTheme } from '../../theme/context';
import { spinnerColor, spinnerPx, type SpinnerProps } from './Spinner.types';

/**
 * A rotating three-quarter ring. It keeps spinning with reduced motion because it conveys "busy".
 */
export function Spinner(props: SpinnerProps) {
  const theme = useTheme();
  const size = spinnerPx(props.size);
  const color = spinnerColor(theme, props);
  const { testID } = props;
  const label = props.label === undefined ? 'Loading' : props.label;
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
      {...(label
        ? { accessible: true, accessibilityRole: 'progressbar' as const, accessibilityLabel: label }
        : { accessible: false })}
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
