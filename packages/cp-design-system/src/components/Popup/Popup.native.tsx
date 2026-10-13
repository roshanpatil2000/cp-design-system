import { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Keyframe } from 'react-native-reanimated';
import { useComponent } from '../../theme/useComponent';
import { placeFloating } from '../internal/placement';
import { useAnchorRect } from '../internal/useAnchorRect.native';
import { getPopupTokens, type PopupProps } from './Popup.types';

const popIn = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.98 }] },
  100: { opacity: 1, transform: [{ scale: 1 }] },
}).duration(150);

/** A floating panel anchored to a trigger. Tapping outside or Android back closes it. */
export function Popup(input: PopupProps) {
  const { props, tokens: t, spring } = useComponent('Popup', input, getPopupTokens);
  return <PopupBase {...props} tokens={t} animated={!!spring} />;
}

/** Internal: Popup with resolved tokens, shared with InlineDialog. */
export function PopupBase(
  props: Omit<PopupProps, 'tokens'> & {
    tokens: ReturnType<typeof getPopupTokens>;
    animated: boolean;
  },
) {
  const t = props.tokens;
  const anchorRef = useRef<View>(null);
  const window = useWindowDimensions();
  const anchor = useAnchorRect(props.isOpen, anchorRef);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const maxWidth = Math.min(t.maxWidth, window.width - 16);
  const pos = anchor
    ? placeFloating(anchor, size, window, props.placement ?? 'bottom-start', t.offset)
    : null;

  return (
    <>
      <View ref={anchorRef} collapsable={false} style={{ alignSelf: 'flex-start' }}>
        {props.trigger}
      </View>
      <Modal
        visible={props.isOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={props.onClose}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Close"
          testID={props.testID && `${props.testID}-backdrop`}
          onPress={props.onClose}
        />
        {pos ? (
          <Animated.View
            testID={props.testID}
            accessibilityLabel={props.label}
            accessibilityViewIsModal
            entering={props.animated ? popIn : undefined}
            onLayout={(e) =>
              setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })
            }
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              width: props.width,
              maxWidth,
              padding: t.padding,
              borderRadius: t.radius,
              backgroundColor: t.background,
              shadowColor: '#1E1F21',
              shadowOpacity: 0.2,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }}
          >
            {props.content}
          </Animated.View>
        ) : null}
      </Modal>
    </>
  );
}
