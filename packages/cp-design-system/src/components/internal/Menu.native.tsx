import { Fragment, useState, type RefObject } from 'react';
import {
  Modal,
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
import { getMenuTokens, groupHeaderAt, type MenuOption, type MenuTokens } from './menuTokens';
import { placeFloating, type Placement } from './placement';
import { useAnchorRect } from './useAnchorRect.native';

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
  placement?: Placement;
  keepOpenOnSelect?: boolean;
  tokens?: Partial<MenuTokens>;
  testID?: string;
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
  const anchor = useAnchorRect(props.isOpen, props.anchorRef);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const listbox = props.role === 'listbox';
  const placement = props.placement ?? (props.alignEnd ? 'bottom-end' : 'bottom-start');
  const pos = anchor
    ? placeFloating(
        anchor,
        { width: Math.max(size.width, anchor.width), height: size.height },
        window,
        placement,
        t.offset,
      )
    : null;

  return (
    <Modal
      visible={props.isOpen}
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
      {anchor && pos ? (
        <Animated.View
          testID={props.testID}
          accessibilityRole={listbox ? 'list' : 'menu'}
          accessibilityLabel={props.label}
          entering={reduceMotion ? undefined : dropIn}
          onLayout={(e) =>
            setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })
          }
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            minWidth: anchor.width,
            maxWidth: window.width - 16,
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
            {props.options.map((o, i) => {
              const selected = listbox && o.value === props.selectedValue;
              const checkable = o.isChecked !== undefined;
              const header = groupHeaderAt(props.options, i);
              const color = o.isDisabled ? t.textDisabled : selected ? t.textSelected : t.text;
              return (
                <Fragment key={o.value}>
                  {header ? (
                    <Text
                      accessibilityRole="header"
                      style={{
                        paddingHorizontal: t.itemPaddingX,
                        paddingTop: i === 0 ? 4 : 12,
                        paddingBottom: 4,
                        marginTop: i === 0 ? 0 : 4,
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderTopColor: t.divider,
                        color: t.groupTitle,
                        fontSize: 11,
                        lineHeight: 16,
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}
                    >
                      {header}
                    </Text>
                  ) : null}
                  <Pressable
                    accessibilityRole={checkable ? 'checkbox' : 'menuitem'}
                    accessibilityLabel={o.label}
                    accessibilityHint={o.description}
                    accessibilityState={{
                      selected,
                      disabled: !!o.isDisabled,
                      checked: checkable ? !!o.isChecked : undefined,
                    }}
                    disabled={o.isDisabled}
                    testID={props.testID && `${props.testID}-${o.value}`}
                    onPress={() => {
                      props.onSelect(o.value);
                      if (!props.keepOpenOnSelect && !checkable) props.onClose();
                    }}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
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
                    {checkable ? (
                      <View style={{ width: 16 }}>
                        {o.isChecked ? (
                          <Icon glyph="check" size="medium" color={t.textSelected} />
                        ) : null}
                      </View>
                    ) : null}
                    {o.icon ? (
                      <Icon
                        glyph={o.icon}
                        size="medium"
                        color={o.isDisabled ? t.textDisabled : t.icon}
                      />
                    ) : null}
                    <View style={{ flexShrink: 1 }}>
                      <Text
                        style={{
                          color,
                          fontSize: t.fontSize,
                          lineHeight: t.lineHeight,
                          fontFamily: t.fontFamily,
                        }}
                      >
                        {o.label}
                      </Text>
                      {o.description ? (
                        <Text
                          style={{
                            color: o.isDisabled ? t.textDisabled : t.description,
                            fontSize: 12,
                            lineHeight: 16,
                            fontFamily: t.fontFamily,
                          }}
                        >
                          {o.description}
                        </Text>
                      ) : null}
                    </View>
                    {listbox && selected ? (
                      <View style={{ marginLeft: 'auto' }}>
                        <Icon glyph="check" size="small" color={t.textSelected} />
                      </View>
                    ) : null}
                  </Pressable>
                </Fragment>
              );
            })}
          </ScrollView>
        </Animated.View>
      ) : null}
    </Modal>
  );
}
