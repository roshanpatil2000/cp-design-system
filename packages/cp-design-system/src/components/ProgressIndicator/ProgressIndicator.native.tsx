import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { mixColors, springTo } from '../../motion/worklet.native';
import { useComponent } from '../../theme/useComponent';
import type { SpringConfig } from '../../theme/types';
import {
  defaultStepLabel,
  getProgressIndicatorTokens,
  type ProgressIndicatorProps,
  type ProgressIndicatorTokens,
} from './ProgressIndicator.types';

function Dot({
  selected,
  t,
  spring,
  testID,
}: {
  selected: boolean;
  t: ProgressIndicatorTokens;
  spring: SpringConfig | null;
  testID?: string;
}) {
  const on = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    on.value = spring ? springTo(selected ? 1 : 0, spring) : selected ? 1 : 0;
  }, [selected, spring, on]);
  const { dotSize, selectedStretch, dot, selected: selectedColor } = t;
  const style = useAnimatedStyle(() => {
    'worklet';
    const p = Math.min(1, Math.max(0, on.value));
    return {
      width: dotSize + dotSize * (selectedStretch - 1) * on.value,
      backgroundColor: mixColors(p, [0, 1], [dot, selectedColor]),
    };
  });
  return (
    <Animated.View
      testID={testID}
      style={[{ height: dotSize, borderRadius: dotSize / 2 }, style]}
    />
  );
}

/** Step dots, as in onboarding carousels. The current dot stretches into a pill with a spring. */
export function ProgressIndicator(input: ProgressIndicatorProps) {
  const {
    props,
    tokens: t,
    spring,
  } = useComponent('ProgressIndicator', input, getProgressIndicatorTokens);
  const label = props.stepLabel ?? defaultStepLabel;
  const interactive = !!props.onSelect;
  return (
    <View
      testID={props.testID}
      accessible={!interactive}
      accessibilityRole={interactive ? 'tablist' : 'progressbar'}
      accessibilityLabel={interactive ? undefined : label(props.selectedIndex, props.count)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: t.gap }}
    >
      {Array.from({ length: props.count }, (_, i) => {
        const selected = i === props.selectedIndex;
        const dotID = props.testID && `${props.testID}-dot-${i}`;
        return interactive ? (
          <Pressable
            key={i}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={label(i, props.count)}
            hitSlop={8}
            onPress={() => props.onSelect?.(i)}
          >
            <Dot selected={selected} t={t} spring={spring} testID={dotID} />
          </Pressable>
        ) : (
          <Dot key={i} selected={selected} t={t} spring={spring} testID={dotID} />
        );
      })}
    </View>
  );
}
