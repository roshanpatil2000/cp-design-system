import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { runOnJS, springTo } from '../../motion/worklet.native';
import { IconButton } from '../IconButton/IconButton.native';
import { ProgressIndicator } from '../ProgressIndicator/ProgressIndicator.native';
import {
  landingIndex,
  slidePx,
  trackOffset,
  type CarouselProps,
  type CarouselTokens,
} from './Carousel.types';
import { useCarousel } from './useCarousel';

/** Fallback spring for the snap-back when motion is off, so a released drag still settles. */
const SNAP_BACK = { stiffness: 1000, damping: 100, mass: 1 };

/** One slide: scales and fades with its distance from the center while the track moves. */
function Slide({
  x,
  i,
  slide,
  width,
  gap,
  viewport,
  t,
  label,
  current,
  testID,
  children,
}: {
  x: SharedValue<number>;
  i: number;
  slide: number;
  /** Width style before the carousel is measured: the `slideWidth` percentage, or pixels. */
  width: number | `${number}%`;
  gap: number;
  viewport: number;
  t: CarouselTokens;
  label: string;
  current: boolean;
  testID?: string;
  children: ReactNode;
}) {
  const { inactiveScale, inactiveOpacity } = t;
  const peek = viewport > 0 && slide < viewport;
  const home = (viewport - slide) / 2 - i * (slide + gap);
  const interval = slide + gap;
  const style = useAnimatedStyle(() => {
    'worklet';
    if (!peek) return { opacity: 1, transform: [{ scale: 1 }] };
    const d = Math.min(1, Math.abs(x.value - home) / interval);
    return {
      opacity: 1 - (1 - inactiveOpacity) * d,
      transform: [{ scale: 1 - (1 - inactiveScale) * d }],
    };
  });
  return (
    <Animated.View
      testID={testID}
      accessibilityLabel={label}
      accessibilityElementsHidden={!current}
      importantForAccessibility={current ? 'auto' : 'no-hide-descendants'}
      style={[{ width: viewport > 0 ? slide : width }, style]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * A row of slides you swipe through, snapping with a spring. With a narrower `slideWidth` the
 * neighbours peek in, scaling and fading with the drag on the UI thread. Vertical scrolling of the
 * page still works over it.
 */
export function Carousel(input: CarouselProps) {
  const [touching, setTouching] = useState(false);
  const c = useCarousel(input, touching);
  const { props, tokens: t, spring, theme } = c;
  const [viewport, setViewport] = useState(0);
  const gap = theme.space[props.space ?? '200'];
  const slide = slidePx(props.slideWidth, viewport);
  const x = useSharedValue(0);
  const dragStart = useSharedValue(0);
  const dragging = useSharedValue(false);

  // Snap to the current slide: instantly on first layout, with the spring afterwards.
  useEffect(() => {
    if (viewport === 0 || dragging.value) return;
    const target = trackOffset(c.index, slide, gap, viewport);
    x.value = spring && x.value !== 0 ? springTo(target, spring) : target;
  }, [c.index, slide, gap, viewport, spring, x, dragging]);

  const { index, count, go } = c;
  const loop = !!props.loop;
  /** Called when a drag ends: move to the slide it lands on, or spring back. */
  const finishDrag = useCallback(
    (dragged: number, velocity: number) => {
      setTouching(false);
      const target = landingIndex(index, dragged, velocity, slide + gap, t);
      const inRange = loop || (target >= 0 && target < count);
      if (target !== index && inRange) {
        go(target);
        return;
      }
      x.value = springTo(trackOffset(index, slide, gap, viewport), spring ?? SNAP_BACK);
    },
    [index, count, go, loop, slide, gap, viewport, spring, t, x],
  );

  const min = trackOffset(count - 1, slide, gap, viewport);
  const max = trackOffset(0, slide, gap, viewport);
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(count > 1)
        .activeOffsetX([-10, 10])
        .failOffsetY([-12, 12])
        .onStart(() => {
          'worklet';
          dragging.value = true;
          dragStart.value = x.value;
          runOnJS(setTouching, true);
        })
        .onUpdate((e) => {
          'worklet';
          const next = dragStart.value + e.translationX;
          // Resist past the first and last slide.
          const over = next > max ? next - max : next < min ? next - min : 0;
          x.value = next - over * 0.7;
        })
        .onEnd((e) => {
          'worklet';
          dragging.value = false;
          runOnJS(finishDrag, x.value - dragStart.value, e.velocityX);
        })
        .onFinalize(() => {
          'worklet';
          dragging.value = false;
        })
        .withTestId(`${props.testID ?? 'carousel'}-pan`),
    [count, min, max, finishDrag, x, dragStart, dragging, props.testID],
  );

  const trackStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateX: x.value }] };
  });

  const showArrows = props.showArrows ?? false;
  const showDots = props.showDots ?? true;

  return (
    <View
      testID={props.testID}
      accessibilityLabel={props.label}
      onLayout={(e) => setViewport(e.nativeEvent.layout.width)}
    >
      <GestureDetector gesture={gesture}>
        <View style={{ overflow: 'hidden' }}>
          <Animated.View
            testID={props.testID && `${props.testID}-track`}
            style={[{ flexDirection: 'row', gap }, trackStyle]}
          >
            {/* Slides render before the width is known (percentage widths resolve on their own),
                so the carousel never grows after layout and shifts the content below it. */}
            {c.slides.map((child, i) => (
              <Slide
                key={child.key ?? i}
                x={x}
                i={i}
                slide={slide}
                width={props.slideWidth ?? '100%'}
                gap={gap}
                viewport={viewport}
                t={t}
                label={c.slideLabel(i, c.count)}
                current={i === c.index}
                testID={props.testID && `${props.testID}-slide-${i}`}
              >
                {child}
              </Slide>
            ))}
          </Animated.View>
        </View>
      </GestureDetector>
      {(showArrows || showDots) && c.count > 1 ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: showArrows ? 'space-between' : 'center',
            gap: 8,
            marginTop: t.dotsGap,
          }}
        >
          {showArrows ? (
            <IconButton
              icon="chevron-left"
              label="Previous slide"
              shape="circle"
              isDisabled={!c.canPrev}
              onPress={c.prev}
            />
          ) : null}
          {showDots ? (
            <ProgressIndicator
              count={c.count}
              selectedIndex={c.index}
              onSelect={c.go}
              appearance="primary"
              stepLabel={(i, n) => `Go to slide ${i + 1} of ${n}`}
              testID={props.testID && `${props.testID}-dots`}
            />
          ) : null}
          {showArrows ? (
            <IconButton
              icon="chevron-right"
              label="Next slide"
              shape="circle"
              isDisabled={!c.canNext}
              onPress={c.next}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
