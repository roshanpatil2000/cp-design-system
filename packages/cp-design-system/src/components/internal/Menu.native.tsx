import { useEffect, useState, type RefObject } from 'react';
import {
  Modal,
  Platform,
  StatusBar,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { Keyframe } from 'react-native-reanimated';
import { useReducedMotion, useTheme } from '../../theme/context';
import { Icon } from '../Icon/Icon.native';
import { getMenuTokens, type MenuOption, type MenuTokens } from './menuTokens';

export interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: MenuOption[];
  anchorRef: RefObject<View | null>;
  role: 'listbox' | 'menu';
  selectedValue?: string | null;
  label?: string;
  alignEnd?: boolean;
  tokens?: Partial<MenuTokens>;
  testID?: string;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const dropIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: -4 }, { scale: 0.98 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
}).duration(150);

/**
 * A dropdown list anchored to a trigger, in a transparent RN Modal. Opens below the trigger or
 * above it when there's no room; tapping outside or Android back closes it.
 */
export function Menu(props: MenuProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const t = { ...getMenuTokens(theme), ...props.tokens };
  const window = useWindowDimensions();
  const [anchor, setAnchor] = useState<Rect | null>(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const [menuWidth, setMenuWidth] = useState(0);
  const { isOpen, anchorRef } = props;

  useEffect(() => {
    if (!isOpen) {
      setAnchor(null);
      return;
    }
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      // Android measures below the status bar, but the translucent Modal starts above it.
      const offset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
      setAnchor({ x, y: y + offset, width, height });
    });
  }, [isOpen, anchorRef]);

  const below = anchor ? anchor.y + anchor.height + t.offset : 0;
  const above =
    anchor &&
    menuHeight > 0 &&
    below + menuHeight > window.height - 16 &&
    anchor.y - menuHeight > 16;
  const top = anchor ? (above ? anchor.y - t.offset - menuHeight : below) : 0;
  const width = anchor?.width ?? 0;
  const listbox = props.role === 'listbox';

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={props.onClose}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        accessibilityLabel="Close menu"
        testID={props.testID && `${props.testID}-backdrop`}
        onPress={props.onClose}
      />
      {anchor ? (
        <Animated.View
          testID={props.testID}
          accessibilityRole={listbox ? 'list' : 'menu'}
          accessibilityLabel={props.label}
          entering={reduceMotion ? undefined : dropIn}
          onLayout={(e) => {
            setMenuHeight(e.nativeEvent.layout.height);
            setMenuWidth(e.nativeEvent.layout.width);
          }}
          style={{
            position: 'absolute',
            top,
            ...(props.alignEnd && anchor && anchor.x + anchor.width > menuWidth + 8
              ? { right: Math.max(8, window.width - anchor.x - anchor.width) }
              : { left: Math.max(8, Math.min(anchor?.x ?? 0, window.width - menuWidth - 8)) }),
            minWidth: width,
            maxWidth: window.width - 32,
            maxHeight: t.maxHeight,
            paddingVertical: t.paddingY,
            borderRadius: t.radius,
            backgroundColor: t.background,
            shadowColor: '#1E1F21',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          }}
        >
          <ScrollView bounces={false}>
            {props.options.map((o) => {
              const selected = o.value === props.selectedValue;
              return (
                <Pressable
                  key={o.value}
                  accessibilityRole="menuitem"
                  accessibilityLabel={o.label}
                  accessibilityState={{ selected, disabled: !!o.isDisabled }}
                  disabled={o.isDisabled}
                  testID={props.testID && `${props.testID}-${o.value}`}
                  onPress={() => {
                    props.onSelect(o.value);
                    props.onClose();
                  }}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    minHeight: 44,
                    paddingHorizontal: t.itemPaddingX,
                    paddingVertical: t.itemPaddingY,
                    backgroundColor: selected
                      ? t.itemSelected
                      : pressed
                        ? t.itemPressed
                        : 'transparent',
                  })}
                >
                  {selected ? (
                    <View
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        backgroundColor: t.selectedBar,
                      }}
                    />
                  ) : null}
                  <Text
                    style={{
                      flexShrink: 1,
                      color: o.isDisabled ? t.textDisabled : selected ? t.textSelected : t.text,
                      fontSize: t.fontSize,
                      lineHeight: t.lineHeight,
                      fontFamily: t.fontFamily,
                    }}
                  >
                    {o.label}
                  </Text>
                  {listbox && selected ? (
                    <Icon glyph="check" size="small" color={t.textSelected} />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      ) : null}
    </Modal>
  );
}
