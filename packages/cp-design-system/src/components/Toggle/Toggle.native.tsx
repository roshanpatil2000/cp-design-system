import { useEffect, useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { mixColors, runOnJS, springTo, stopAnimation } from '../../motion/worklet.native';
import { thumbGeometry, toggleIconLayout } from './Toggle.geometry';
import { thumbTravel } from './Toggle.tokens';
import type { ToggleProps } from './Toggle.types';
import { useToggle } from './useToggle';

/** Fling speed (px/s) that decides a drag regardless of where the thumb was released. */
const FLING_VELOCITY = 400;
/** Extra touch area so the 16-20px track meets the 44pt minimum target. */
const HIT_SLOP = { vertical: 14, horizontal: 8 };

export function Toggle(input: ToggleProps) {
  const {
    props,
    tokens: t,
    spring,
    checked,
    interactive,
    commit,
    toggle,
    settleKey,
  } = useToggle(input);
  const travel = thumbTravel(t);
  const icons = toggleIconLayout(t);
  const squish = !!spring && t.thumbStretch > 0;
  const disabled = !!props.isDisabled;

  const progress = useSharedValue(checked ? 1 : 0);
  const press = useSharedValue(0);
  const pulse = useSharedValue(1);
  const dragStart = useSharedValue(0);
  const dragging = useSharedValue(false);

  useEffect(() => {
    if (dragging.value) return;
    const target = checked ? 1 : 0;
    progress.value = spring ? springTo(target, spring) : target;
  }, [checked, settleKey, spring, progress, dragging]);

  useEffect(() => {
    if (props.isLoading && spring) {
      pulse.value = withRepeat(
        withSequence(withTiming(0.72, { duration: 450 }), withTiming(1, { duration: 450 })),
        -1,
      );
    } else {
      stopAnimation(pulse);
      pulse.value = 1;
    }
  }, [props.isLoading, spring, pulse]);

  const gesture = useMemo(() => {
    const pressTo = (value: number) => {
      'worklet';
      if (squish && spring) press.value = springTo(value, spring);
    };
    const tap = Gesture.Tap()
      .enabled(interactive)
      .hitSlop(HIT_SLOP)
      .maxDuration(10_000)
      .onBegin(() => {
        'worklet';
        pressTo(1);
      })
      .onFinalize(() => {
        'worklet';
        pressTo(0);
      })
      .onEnd((_event, success) => {
        'worklet';
        if (success) runOnJS(toggle);
      })
      .withTestId(`${props.testID ?? 'toggle'}-tap`);
    const pan = Gesture.Pan()
      .enabled(interactive)
      .hitSlop(HIT_SLOP)
      .activeOffsetX([-4, 4])
      .failOffsetY([-12, 12])
      .onBegin(() => {
        'worklet';
        pressTo(1);
      })
      .onStart(() => {
        'worklet';
        dragging.value = true;
        stopAnimation(progress);
        dragStart.value = progress.value;
      })
      .onUpdate((event) => {
        'worklet';
        progress.value = Math.min(1, Math.max(0, dragStart.value + event.translationX / travel));
      })
      .onEnd((event) => {
        'worklet';
        const next =
          Math.abs(event.velocityX) > FLING_VELOCITY ? event.velocityX > 0 : progress.value > 0.5;
        dragging.value = false;
        runOnJS(commit, next);
      })
      .onFinalize(() => {
        'worklet';
        dragging.value = false;
        pressTo(0);
      })
      .withTestId(`${props.testID ?? 'toggle'}-pan`);
    return Gesture.Race(pan, tap);
  }, [
    interactive,
    squish,
    spring,
    travel,
    toggle,
    commit,
    props.testID,
    press,
    progress,
    dragStart,
    dragging,
  ]);

  // Explicit 'worklet' directives: this file ships pre-compiled, so the app's Babel plugin can't
  // rely on recognizing these callbacks by name.
  const geometry = {
    width: t.width,
    thumbSize: t.thumbSize,
    thumbInset: t.thumbInset,
    thumbStretch: t.thumbStretch,
  };
  const trackStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      backgroundColor: disabled
        ? t.trackDisabled
        : mixColors(progress.value, [0, 1], [t.trackOff, t.trackOn]),
    };
  });
  const thumbStyle = useAnimatedStyle(() => {
    'worklet';
    const { x, width } = thumbGeometry(geometry, progress.value, press.value);
    return { width, transform: [{ translateX: x }, { scale: pulse.value }] };
  });
  const checkStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: progress.value,
      transform: [{ rotate: '45deg' }, { scale: 0.5 + 0.5 * progress.value }],
    };
  });
  // Each bar rotates and scales around its own center so the cross shrinks in place.
  const crossBarA = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: 1 - progress.value,
      transform: [{ rotate: '45deg' }, { scale: 1 - 0.5 * progress.value }],
    };
  });
  const crossBarB = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: 1 - progress.value,
      transform: [{ rotate: '-45deg' }, { scale: 1 - 0.5 * progress.value }],
    };
  });

  const iconColor = (on: boolean) => (disabled ? t.iconDisabled : on ? t.iconOn : t.iconOff);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        accessible
        accessibilityRole="switch"
        accessibilityLabel={props.label}
        accessibilityState={{ checked, disabled, busy: !!props.isLoading }}
        accessibilityActions={[{ name: 'activate' }]}
        onAccessibilityAction={(e) => {
          if (e.nativeEvent.actionName === 'activate') toggle();
        }}
        testID={props.testID}
        style={[{ width: t.width, height: t.height, borderRadius: 9999 }, trackStyle]}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              ...icons.check,
              borderColor: iconColor(true),
              borderRightWidth: icons.stroke,
              borderBottomWidth: icons.stroke,
            },
            checkStyle,
          ]}
        />
        {[crossBarA, crossBarB].map((barStyle, i) => (
          <Animated.View
            key={i}
            style={[
              {
                position: 'absolute',
                ...icons.cross,
                borderRadius: icons.stroke,
                backgroundColor: iconColor(false),
              },
              barStyle,
            ]}
          />
        ))}
        <Animated.View
          testID={props.testID && `${props.testID}-thumb`}
          style={[
            {
              position: 'absolute',
              top: (t.height - t.thumbSize) / 2,
              left: 0,
              height: t.thumbSize,
              borderRadius: 9999,
              backgroundColor: t.thumb,
              shadowColor: '#091E42',
              shadowOpacity: disabled ? 0 : 0.25,
              shadowRadius: 1.5,
              shadowOffset: { width: 0, height: 1 },
              elevation: disabled ? 0 : 1,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
}
