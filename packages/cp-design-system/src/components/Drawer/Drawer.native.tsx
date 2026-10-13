import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { fontWeightFor } from '../../theme/createTheme';
import { useComponent } from '../../theme/useComponent';
import { runOnJS, springTo, timeTo } from '../../motion/worklet.native';
import { IconButton } from '../IconButton/IconButton.native';
import { FlagOutlet } from '../Flag/Flag.native';
import {
  DISMISS_FRACTION,
  DISMISS_VELOCITY,
  getDrawerTokens,
  type DrawerProps,
} from './Drawer.types';

/**
 * A bottom sheet: slides up over a blanket, and closes with a swipe down on its handle or header,
 * a blanket tap, the close button or Android back.
 */
export function Drawer(input: DrawerProps) {
  const {
    theme,
    props,
    tokens: t,
    spring,
  } = useComponent('Drawer', input, getDrawerTokens, 'gentle');
  const window = useWindowDimensions();
  const [mounted, setMounted] = useState(props.isOpen);
  if (props.isOpen && !mounted) setMounted(true);
  const height = useSharedValue(window.height);
  const offset = useSharedValue(window.height);
  const blanket = useSharedValue(0);
  const closing = useRef(false);

  const finish = () => {
    closing.current = false;
    setMounted(false);
    props.onCloseComplete?.();
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;
  const onFinished = useMemo(() => () => finishRef.current(), []);

  useEffect(() => {
    if (!mounted) return;
    if (props.isOpen) {
      closing.current = false;
      blanket.value = spring ? timeTo(1, { duration: 200 }) : 1;
      offset.value = spring ? springTo(0, spring) : 0;
      return;
    }
    if (closing.current) return;
    closing.current = true;
    if (!spring) {
      offset.value = height.value;
      blanket.value = 0;
      onFinished();
      return;
    }
    const exit = { duration: 200, easing: Easing.bezier(0.6, 0, 0.8, 0.6) };
    blanket.value = timeTo(0, exit);
    offset.value = timeTo(height.value, exit, (done) => {
      'worklet';
      if (done) runOnJS(onFinished);
    });
  }, [props.isOpen, mounted, spring, offset, blanket, height, onFinished]);

  const { onClose } = props;
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY(6)
        .onUpdate((e) => {
          'worklet';
          offset.value = Math.max(0, e.translationY);
        })
        .onEnd((e) => {
          'worklet';
          if (offset.value > height.value * DISMISS_FRACTION || e.velocityY > DISMISS_VELOCITY) {
            runOnJS(onClose);
          } else if (spring) {
            offset.value = springTo(0, spring);
          } else {
            offset.value = 0;
          }
        })
        .withTestId(`${props.testID ?? 'drawer'}-pan`),
    [offset, height, onClose, spring, props.testID],
  );

  const sheetStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateY: offset.value }] };
  });
  const blanketStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: blanket.value };
  });

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={props.onClose}
    >
      <GestureHandlerRootView style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: t.blanket }, blanketStyle]}
        >
          <Pressable
            testID={props.testID && `${props.testID}-blanket`}
            accessibilityLabel="Close"
            style={StyleSheet.absoluteFill}
            onPress={props.onClose}
          />
        </Animated.View>
        <Animated.View
          testID={props.testID}
          accessibilityViewIsModal
          accessibilityLabel={props.title ?? props.label}
          onAccessibilityEscape={props.onClose}
          onLayout={(e) => {
            height.value = e.nativeEvent.layout.height;
          }}
          style={[
            {
              maxHeight: window.height * 0.9,
              borderTopLeftRadius: t.radius,
              borderTopRightRadius: t.radius,
              backgroundColor: t.background,
              shadowColor: '#1E1F21',
              shadowOpacity: 0.2,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: -4 },
              elevation: 16,
            },
            sheetStyle,
          ]}
        >
          <GestureDetector gesture={pan}>
            <View>
              <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
                <View
                  style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: t.handle }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingLeft: t.padding,
                  paddingRight: t.padding - 8,
                }}
              >
                {props.title ? (
                  <Text
                    accessibilityRole="header"
                    style={{
                      flexShrink: 1,
                      color: t.titleColor,
                      fontFamily: theme.fontFamily.heading,
                      fontSize: theme.text['heading.medium'].fontSize,
                      lineHeight: theme.text['heading.medium'].lineHeight,
                      fontWeight: fontWeightFor(theme.text['heading.medium'].fontWeight),
                    }}
                  >
                    {props.title}
                  </Text>
                ) : (
                  <View />
                )}
                <IconButton
                  icon="cross"
                  label="Close"
                  appearance="subtle"
                  onPress={props.onClose}
                  testID={props.testID && `${props.testID}-close`}
                />
              </View>
            </View>
          </GestureDetector>
          <ScrollView
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ padding: t.padding, paddingBottom: t.padding + 16 }}
          >
            {props.children}
          </ScrollView>
        </Animated.View>
        <FlagOutlet />
      </GestureHandlerRootView>
    </Modal>
  );
}
