import { useEffect } from 'react';
import {
  Modal as RNModal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { fontWeightFor } from '../../theme/createTheme';
import { runOnJS, timeTo } from '../../motion/worklet.native';
import type { Bezier } from '../../tokens/atlassian/motion.generated';
import { StatusIcon } from '../internal/StatusIcon.native';
import type { ModalProps } from './Modal.types';
import { useModal } from './useModal';

/** Space kept around a card-style dialog. */
const MARGIN = 16;
/**
 * A dialog goes full screen when its width is this much wider than the screen allows, so a
 * medium form fills a phone while a small confirmation stays a card.
 */
const FULL_SCREEN_RATIO = 1.25;

/**
 * Atlassian's modal dialog on React Native: a fading blanket and a dialog that slides up,
 * inside a transparent RN `Modal`. Android back calls `onClose`.
 */
export function Modal(input: ModalProps) {
  const m = useModal(input);
  const { props, tokens: t, animated, width, icon, finishClose } = m;
  const window = useWindowDimensions();
  const available = window.width - 2 * MARGIN;
  const fullScreen = width > available * FULL_SCREEN_RATIO;
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!m.mounted) return;
    const target = props.isOpen ? 1 : 0;
    if (!animated) {
      progress.value = target;
      if (!props.isOpen) finishClose();
      return;
    }
    const curve: { duration: number; easing: Bezier } = props.isOpen ? m.enter : m.exit;
    progress.value = timeTo(
      target,
      { duration: curve.duration, easing: Easing.bezier(...curve.easing) },
      (finished) => {
        'worklet';
        if (finished && target === 0) runOnJS(finishClose);
      },
    );
  }, [props.isOpen, m.mounted, animated, m.enter, m.exit, progress, finishClose]);

  const slide = t.slide;
  const blanketStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: progress.value };
  });
  const dialogStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: progress.value,
      transform: [{ translateY: (1 - progress.value) * slide }],
    };
  });

  const closeOnBlanket = props.shouldCloseOnBlanketClick ?? true;
  const text = { fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight };

  return (
    <RNModal
      visible={m.mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={props.onClose}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { alignItems: 'center', justifyContent: fullScreen ? 'flex-start' : 'center' },
        ]}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: t.blanket }, blanketStyle]}
        >
          <Pressable
            testID={props.testID && `${props.testID}-blanket`}
            accessibilityLabel="Close"
            style={StyleSheet.absoluteFill}
            onPress={() => closeOnBlanket && props.onClose()}
          />
        </Animated.View>
        <Animated.View
          testID={props.testID}
          accessibilityViewIsModal
          onAccessibilityEscape={props.onClose}
          aria-modal
          style={[
            fullScreen
              ? { flex: 1, width: '100%', paddingTop: 40 }
              : {
                  width: Math.min(width, available),
                  maxHeight: window.height - 2 * t.offsetTop,
                  borderRadius: t.radius,
                },
            {
              backgroundColor: t.background,
              shadowColor: '#1E1F21',
              shadowOpacity: 0.25,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 8 },
              elevation: 12,
            },
            dialogStyle,
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingTop: t.headerPaddingTop,
              paddingBottom: t.headerPaddingBottom,
              paddingHorizontal: t.paddingX,
            }}
          >
            {icon && props.appearance ? (
              <StatusIcon
                kind={props.appearance === 'danger' ? 'error' : 'warning'}
                size={20}
                color={icon}
                glyph={t.iconGlyph}
              />
            ) : null}
            <Text
              accessibilityRole="header"
              style={{
                flexShrink: 1,
                color: t.title,
                fontFamily: t.headingFontFamily ?? t.fontFamily,
                fontSize: t.titleFontSize,
                lineHeight: t.titleLineHeight,
                fontWeight: fontWeightFor(t.titleFontWeight),
              }}
            >
              {props.title}
            </Text>
          </View>
          <ScrollView
            style={{ flexGrow: fullScreen ? 1 : 0 }}
            contentContainerStyle={{ paddingHorizontal: t.paddingX, paddingVertical: 2 }}
          >
            {typeof props.children === 'string' ? (
              <Text style={{ ...text, color: t.body }}>{props.children}</Text>
            ) : (
              props.children
            )}
          </ScrollView>
          {props.footer ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
                gap: t.footerGap,
                paddingTop: t.footerPaddingTop,
                paddingBottom: t.footerPaddingBottom,
                paddingHorizontal: t.paddingX,
              }}
            >
              {props.footer}
            </View>
          ) : (
            <View style={{ height: t.footerPaddingBottom }} />
          )}
        </Animated.View>
      </View>
    </RNModal>
  );
}
