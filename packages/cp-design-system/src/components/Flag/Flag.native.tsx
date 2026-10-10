import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Keyframe,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { fontWeightFor } from '../../theme/createTheme';
import { runOnJS, springTo, stopAnimation, timeTo } from '../../motion/worklet.native';
import { StatusIcon } from '../internal/StatusIcon.native';
import { FlagContext, useFlagStore, type FlagEntry } from './flagContext';
import type { FlagProviderProps } from './Flag.types';
import { useDismissTimer } from './useDismissTimer';
import { useFlag, useFlagProviderProps } from './useFlag';

/** Swipe distance (pt) or fling speed (pt/s) that dismisses a flag. */
const SWIPE_DISTANCE = 100;
const SWIPE_VELOCITY = 800;
/** Distance from the screen edges; native has no window chrome to clear. */
const EDGE = 16;
const BOTTOM = 32;

/**
 * Renders flags (Atlassian's toasts) at the bottom of the screen over its children and gives
 * descendants `useFlags()` to show them. Wrap your app's root with it.
 */
export function FlagProvider(input: FlagProviderProps) {
  const props = useFlagProviderProps(input);
  const { flags, api, remove, dismissFlag } = useFlagStore(props, true);
  return (
    <FlagContext.Provider value={api}>
      <View style={{ flex: 1 }}>
        {props.children}
        <View
          pointerEvents="box-none"
          accessibilityLabel={props.label ?? 'Notifications'}
          testID={props.testID ?? 'flag'}
          style={[
            StyleSheet.absoluteFill,
            { justifyContent: 'flex-end', padding: EDGE, paddingBottom: BOTTOM },
          ]}
        >
          {flags.map((flag) => (
            <FlagItem
              key={flag.id}
              flag={flag}
              provider={props}
              onDismiss={() => dismissFlag(flag.id)}
              onRemoved={() => remove(flag.id)}
            />
          ))}
        </View>
      </View>
    </FlagContext.Provider>
  );
}

function FlagItem({
  flag,
  provider,
  onDismiss,
  onRemoved,
}: {
  flag: FlagEntry;
  provider: FlagProviderProps;
  onDismiss: () => void;
  onRemoved: () => void;
}) {
  const f = useFlag(flag, provider);
  const t = f.tokens;
  const spring = f.spring;
  const animated = !!spring;
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(t.width, screenWidth - 2 * EDGE);
  const [touching, setTouching] = useState(false);
  const timer = useDismissTimer(f.duration, f.autoDismiss && !flag.leaving, touching, onDismiss);
  const testID = `${provider.testID ?? 'flag'}-${flag.id}`;

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const progress = useSharedValue(1);
  const removed = useRef(false);
  // Stable for the gesture: rebuilding a gesture mid-swipe cancels the exit animation.
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;
  const dismiss = useCallback(() => dismissRef.current(), []);

  const entering = useMemo(
    () =>
      animated
        ? new Keyframe({
            0: { opacity: 0, transform: [{ translateX: -48 }] },
            100: {
              opacity: 1,
              transform: [{ translateX: 0 }],
              easing: Easing.bezier(...f.enter.easing),
            },
          }).duration(f.enter.duration)
        : undefined,
    [animated, f.enter],
  );
  const layout = animated ? LinearTransition.duration(f.reposition.duration) : undefined;

  // Leaving: slide out the way it was swiped (left by default), fade, then drop from the list.
  useEffect(() => {
    if (!flag.leaving || removed.current) return;
    removed.current = true;
    if (!animated) {
      onRemoved();
      return;
    }
    const direction = translateX.value > 0 ? 1 : -1;
    const config = { duration: f.exit.duration, easing: Easing.bezier(...f.exit.easing) };
    translateX.value = timeTo(direction * Math.max(48, Math.abs(translateX.value) + 48), config);
    opacity.value = timeTo(0, config, (finished) => {
      'worklet';
      if (finished) runOnJS(onRemoved);
    });
  }, [flag.leaving, animated, f.exit, translateX, opacity, onRemoved]);

  useEffect(() => {
    progress.value = timer.remaining.current / f.duration;
    if (!timer.running || !animated) {
      stopAnimation(progress);
      return;
    }
    progress.value = timeTo(0, { duration: timer.remaining.current, easing: Easing.linear });
  }, [timer.running, timer.remaining, f.duration, animated, progress]);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(animated)
        .activeOffsetX([-8, 8])
        .failOffsetY([-12, 12])
        .onBegin(() => {
          'worklet';
          runOnJS(setTouching, true);
        })
        .onUpdate((e) => {
          'worklet';
          translateX.value = e.translationX;
        })
        .onEnd((e) => {
          'worklet';
          if (Math.abs(e.translationX) > SWIPE_DISTANCE || Math.abs(e.velocityX) > SWIPE_VELOCITY) {
            runOnJS(dismiss);
          } else if (spring) {
            translateX.value = springTo(0, spring);
          } else {
            translateX.value = 0;
          }
        })
        .onFinalize(() => {
          'worklet';
          runOnJS(setTouching, false);
        })
        .withTestId(`${testID}-pan`),
    [animated, spring, translateX, dismiss, testID],
  );

  const style = useAnimatedStyle(() => {
    'worklet';
    return { opacity: opacity.value, transform: [{ translateX: translateX.value }] };
  });
  const barStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scaleX: progress.value }] };
  });

  const text = { fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight };

  return (
    <Animated.View entering={entering} layout={layout} style={{ marginTop: t.stackGap }}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          testID={testID}
          accessibilityRole={f.role === 'alert' ? 'alert' : 'summary'}
          accessibilityLiveRegion={f.role === 'alert' ? 'assertive' : 'polite'}
          style={[
            {
              width,
              flexDirection: 'row',
              gap: t.gap,
              padding: t.padding,
              borderRadius: t.radius,
              backgroundColor: t.background,
              overflow: 'hidden',
              shadowColor: '#1E1F21',
              shadowOpacity: 0.25,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            },
            style,
          ]}
        >
          {f.icon ? (
            <View style={{ height: t.titleLineHeight, justifyContent: 'center' }}>
              <StatusIcon kind={f.icon} size={t.iconSize} color={t.icon} glyph={t.iconGlyph} />
            </View>
          ) : null}
          <View style={{ flex: 1, gap: 8 }}>
            <Text
              style={{
                ...text,
                color: t.title,
                fontSize: t.titleFontSize,
                lineHeight: t.titleLineHeight,
                fontWeight: fontWeightFor(t.titleFontWeight),
                paddingRight: 24,
              }}
            >
              {flag.title}
            </Text>
            {flag.description ? (
              <Text style={{ ...text, color: t.description }}>{flag.description}</Text>
            ) : null}
            {flag.actions?.length ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {flag.actions.map((a) => (
                  <Pressable
                    key={a.content}
                    accessibilityRole="button"
                    onPress={a.onPress}
                    hitSlop={8}
                  >
                    <Text
                      style={{
                        ...text,
                        color: t.action,
                        fontWeight: fontWeightFor(f.appearance === 'normal' ? 500 : 653),
                        textDecorationLine: f.appearance === 'normal' ? 'none' : 'underline',
                      }}
                    >
                      {a.content}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            testID={`${testID}-dismiss`}
            onPress={onDismiss}
            hitSlop={10}
            style={{
              position: 'absolute',
              top: t.padding - 2,
              right: t.padding - 4,
              width: 24,
              height: 24,
            }}
          >
            {[45, -45].map((angle) => (
              <View
                key={angle}
                style={{
                  position: 'absolute',
                  left: 6,
                  top: 11,
                  width: 12,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: t.title,
                  transform: [{ rotate: `${angle}deg` }],
                }}
              />
            ))}
          </Pressable>
          {f.autoDismiss ? (
            <Animated.View
              testID={`${testID}-progress`}
              style={[
                {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: t.progressHeight,
                  backgroundColor: t.progress,
                  opacity: 0.5,
                  transformOrigin: 'left',
                },
                barStyle,
              ]}
            />
          ) : null}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
