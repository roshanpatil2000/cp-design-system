import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { springTo } from '../../motion/worklet.native';
import { fontWeightFor } from '../../theme/createTheme';
import type { TabsProps } from './Tabs.types';
import { useTabs } from './useTabs';

/**
 * Atlassian tabs: a scrollable tab row with an underline that springs to the selected tab, and
 * the selected panel below.
 */
export function Tabs(input: TabsProps) {
  const s = useTabs(input);
  const { props, tokens: t, spring } = s;
  const layouts = useRef<Record<number, { x: number; width: number }>>({});
  const left = useSharedValue(0);
  const width = useSharedValue(0);

  const moveTo = (index: number, animate: boolean) => {
    const l = layouts.current[index];
    if (!l) return;
    left.value = animate && spring ? springTo(l.x, spring) : l.x;
    width.value = animate && spring ? springTo(l.width, spring) : l.width;
  };
  useEffect(() => {
    moveTo(s.selectedIndex, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.selectedIndex, spring]);

  const indicatorStyle = useAnimatedStyle(() => {
    'worklet';
    return { width: width.value, transform: [{ translateX: left.value }] };
  });
  const panel = props.tabs[s.selectedIndex];

  return (
    <View testID={props.testID}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!props.shouldFitContainer}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          accessibilityRole="tablist"
          accessibilityLabel={props.label}
          style={{ flexDirection: 'row', flexGrow: 1, gap: t.gap }}
        >
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: t.dividerHeight,
              backgroundColor: t.divider,
            }}
          />
          {props.tabs.map((tab, i) => {
            const selected = i === s.selectedIndex;
            return (
              <Pressable
                key={tab.id}
                testID={props.testID && `${props.testID}-${tab.id}`}
                accessibilityRole="tab"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected, disabled: !!tab.isDisabled }}
                disabled={tab.isDisabled}
                onPress={() => s.select(tab.id)}
                onLayout={(e) => {
                  const { x, width: w } = e.nativeEvent.layout;
                  layouts.current[i] = { x, width: w };
                  if (i === s.selectedIndex) moveTo(i, false);
                }}
                style={({ pressed }) => ({
                  flex: props.shouldFitContainer ? 1 : undefined,
                  height: Math.max(t.height, 44),
                  paddingHorizontal: t.paddingX + 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: pressed && !tab.isDisabled ? t.hoverBackground : 'transparent',
                })}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: tab.isDisabled ? t.textDisabled : selected ? t.textSelected : t.text,
                    fontFamily: t.fontFamily,
                    fontSize: t.fontSize,
                    lineHeight: t.lineHeight,
                    fontWeight: fontWeightFor(t.fontWeight),
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
          <Animated.View
            testID={props.testID && `${props.testID}-indicator`}
            style={[
              {
                position: 'absolute',
                left: 0,
                bottom: 0,
                height: t.indicatorHeight,
                borderRadius: t.indicatorHeight,
                backgroundColor: t.indicator,
              },
              indicatorStyle,
            ]}
          />
        </View>
      </ScrollView>
      {panel && panel.content !== undefined ? (
        <Animated.View
          key={panel.id}
          entering={spring ? FadeIn.duration(150) : undefined}
          style={{ paddingTop: 16 }}
        >
          {typeof panel.content === 'string' ? (
            <Text style={{ color: t.textHovered, fontSize: t.fontSize, lineHeight: t.lineHeight }}>
              {panel.content}
            </Text>
          ) : (
            panel.content
          )}
        </Animated.View>
      ) : null}
    </View>
  );
}
