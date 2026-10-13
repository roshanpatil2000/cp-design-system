import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { runOnJS, springTo } from '../../motion/worklet.native';
import type { RangeProps } from './Range.types';
import { useRange } from './useRange';

/** A slider for picking a number in a range: drag the thumb or tap the track. */
export function Range(input: RangeProps) {
  const r = useRange(input);
  const { props, tokens: t, spring } = r;
  const width = useSharedValue(0);
  const progress = useSharedValue(r.fraction);
  const press = useSharedValue(0);
  const dragging = useSharedValue(false);

  useEffect(() => {
    if (dragging.value) {
      progress.value = r.fraction;
      return;
    }
    progress.value = spring ? springTo(r.fraction, spring) : r.fraction;
  }, [r.fraction, spring, progress, dragging]);

  const { setFraction } = r;
  // Gesture x is measured from the outer view, which pads the track by half a thumb.
  const inset = t.thumbSize / 2;
  const gesture = useMemo(() => {
    const pressTo = (v: number) => {
      'worklet';
      press.value = spring ? springTo(v, spring) : v;
    };
    const pan = Gesture.Pan()
      .enabled(!r.disabled)
      .activeOffsetX([-3, 3])
      .failOffsetY([-15, 15])
      .onBegin(() => {
        'worklet';
        pressTo(1);
      })
      .onStart(() => {
        'worklet';
        dragging.value = true;
      })
      .onUpdate((e) => {
        'worklet';
        if (width.value > 0) runOnJS(setFraction, (e.x - inset) / width.value);
      })
      .onFinalize(() => {
        'worklet';
        dragging.value = false;
        pressTo(0);
      })
      .withTestId(`${props.testID ?? 'range'}-pan`);
    const tap = Gesture.Tap()
      .enabled(!r.disabled)
      .onEnd((e, success) => {
        'worklet';
        if (success && width.value > 0) runOnJS(setFraction, (e.x - inset) / width.value);
      })
      .withTestId(`${props.testID ?? 'range'}-tap`);
    return Gesture.Race(pan, tap);
  }, [r.disabled, spring, setFraction, inset, props.testID, width, press, dragging]);

  const { thumbSize, thumbPressedScale } = t;
  const fillStyle = useAnimatedStyle(() => {
    'worklet';
    return { width: width.value * progress.value };
  });
  const thumbStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: width.value * progress.value - thumbSize / 2 },
        { scale: 1 + (thumbPressedScale - 1) * press.value },
      ],
    };
  });

  const big = Math.max(r.step, (r.max - r.min) / 10);
  return (
    <GestureDetector gesture={gesture}>
      <View
        testID={props.testID}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={props.label}
        accessibilityValue={{ min: r.min, max: r.max, now: r.value, text: r.valueText }}
        accessibilityState={{ disabled: r.disabled }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => {
          if (e.nativeEvent.actionName === 'increment') r.set(r.value + big);
          if (e.nativeEvent.actionName === 'decrement') r.set(r.value - big);
        }}
        style={{ height: t.hitHeight, justifyContent: 'center', paddingHorizontal: thumbSize / 2 }}
      >
        <View
          testID={props.testID && `${props.testID}-track`}
          onLayout={(e) => {
            width.value = e.nativeEvent.layout.width;
          }}
          style={{ height: t.trackHeight, borderRadius: t.trackHeight, backgroundColor: t.track }}
        >
          <Animated.View
            testID={props.testID && `${props.testID}-fill`}
            style={[
              {
                height: '100%',
                borderRadius: t.trackHeight,
                backgroundColor: r.disabled ? t.disabledFill : t.fill,
              },
              fillStyle,
            ]}
          />
          <Animated.View
            testID={props.testID && `${props.testID}-thumb`}
            style={[
              {
                position: 'absolute',
                top: (t.trackHeight - thumbSize) / 2,
                left: 0,
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                backgroundColor: t.thumb,
                borderWidth: 1,
                borderColor: t.thumbBorder,
                shadowColor: '#1E1F21',
                shadowOpacity: r.disabled ? 0 : 0.25,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
                elevation: r.disabled ? 0 : 2,
              },
              thumbStyle,
            ]}
          />
        </View>
      </View>
    </GestureDetector>
  );
}
