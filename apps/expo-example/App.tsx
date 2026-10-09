import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Switch, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import {
  ThemeProvider,
  atlassianTheme,
  createTheme,
  fontWeightFor,
  resolveSpring,
  useHaptics,
  useReducedMotion,
  useTheme,
  type HapticsAdapter,
  type SpringName,
  type ThemeColor,
  type ThemePair,
} from 'cp-design-system';

const brands: Record<string, ThemePair> = {
  Atlassian: atlassianTheme,
  Violet: createTheme({ brand: '#7C3AED' }),
  Crimson: createTheme({ brand: '#E5484D' }),
  Emerald: createTheme({ brand: '#0E9F6E' }),
  Amber: createTheme({ brand: '#F5B800' }),
};

const haptics: HapticsAdapter = (event) => {
  if (event === 'selection') Haptics.selectionAsync();
  else if (event === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const swatches: ThemeColor[] = [
  'color.background.brand.bold',
  'color.background.brand.bold.hovered',
  'color.background.brand.subtlest',
  'color.border.focused',
  'color.text.brand',
  'color.background.success.bold',
  'color.background.warning.bold',
  'color.background.danger.bold',
];

function Heading({ children }: { children: string }) {
  const theme = useTheme();
  const style = theme.text['heading.small'];
  return (
    <Text
      style={{
        color: theme.color['color.text'],
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        fontWeight: fontWeightFor(style.fontWeight),
        marginBottom: theme.space['100'],
      }}
    >
      {children}
    </Text>
  );
}

function SpringRow({ name, on }: { name: SpringName; on: boolean }) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const x = useSharedValue(0);
  useEffect(() => {
    const spring = resolveSpring(theme, reduced, name);
    x.value = spring ? withSpring(on ? 240 : 0, spring) : on ? 240 : 0;
  }, [on, name, reduced, theme, x]);
  const dot = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <Text style={{ width: 64, color: theme.color['color.text.subtle'], fontSize: 12 }}>
        {name}
      </Text>
      <View
        style={{
          width: 272,
          height: 32,
          borderRadius: theme.radius.full,
          backgroundColor: theme.color['color.background.neutral'],
        }}
      >
        <Animated.View
          style={[
            {
              width: 32,
              height: 32,
              borderRadius: theme.radius.full,
              backgroundColor: theme.color['color.background.brand.bold'],
            },
            dot,
          ]}
        />
      </View>
    </View>
  );
}

function Foundations({
  brand,
  setBrand,
  dark,
  setDark,
  reduced,
  setReduced,
}: {
  brand: string;
  setBrand: (b: string) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
  reduced: boolean;
  setReduced: (v: boolean) => void;
}) {
  const theme = useTheme();
  const emit = useHaptics();
  const [on, setOn] = useState(false);
  const text = { color: theme.color['color.text'] };

  return (
    <ScrollView contentContainerStyle={{ padding: theme.space['250'], gap: theme.space['300'] }}>
      <Text
        style={{
          ...text,
          fontSize: theme.text['heading.large'].fontSize,
          lineHeight: theme.text['heading.large'].lineHeight,
          fontWeight: fontWeightFor(theme.text['heading.large'].fontWeight),
        }}
      >
        cp-design-system
      </Text>

      <View>
        <Heading>Brand</Heading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space['100'] }}>
          {Object.keys(brands).map((name) => {
            const selected = name === brand;
            return (
              <Pressable
                key={name}
                onPress={() => {
                  emit('selection');
                  setBrand(name);
                }}
                style={{
                  paddingHorizontal: theme.space['150'],
                  paddingVertical: theme.space['075'],
                  borderRadius: theme.radius.full,
                  backgroundColor: selected
                    ? theme.color['color.background.brand.bold']
                    : theme.color['color.background.neutral'],
                }}
              >
                <Text
                  style={{
                    color: selected ? theme.color['color.text.onBrand'] : theme.color['color.text'],
                    fontWeight: '600',
                  }}
                >
                  {name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: theme.space['100'] }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={text}>Dark mode</Text>
          <Switch value={dark} onValueChange={setDark} />
        </View>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={text}>Reduce motion</Text>
          <Switch value={reduced} onValueChange={setReduced} />
        </View>
      </View>

      <View>
        <Heading>Semantic colors</Heading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space['100'] }}>
          {swatches.map((token) => (
            <View key={token} style={{ width: 76 }}>
              <View
                style={{
                  height: 40,
                  borderRadius: theme.radius.medium,
                  backgroundColor: theme.color[token],
                  borderWidth: 1,
                  borderColor: theme.color['color.border'],
                }}
              />
              <Text style={{ fontSize: 10, color: theme.color['color.text.subtle'] }}>
                {token.replace('color.background.', '').replace('color.', '')}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View>
        <Heading>Springs (Reanimated)</Heading>
        <Pressable
          onPress={() => {
            emit('impactLight');
            setOn((v) => !v);
          }}
          style={{
            alignSelf: 'flex-start',
            marginBottom: theme.space['150'],
            paddingHorizontal: theme.space['150'],
            paddingVertical: theme.space['075'],
            borderRadius: theme.radius.medium,
            backgroundColor: theme.color['color.background.brand.bold'],
          }}
        >
          <Text style={{ color: theme.color['color.text.onBrand'], fontWeight: '600' }}>
            Animate
          </Text>
        </Pressable>
        {(Object.keys(theme.motion.springs) as SpringName[]).map((name) => (
          <SpringRow key={name} name={name} on={on} />
        ))}
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [brand, setBrand] = useState('Atlassian');
  const [dark, setDark] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pair = brands[brand] ?? atlassianTheme;
  const surface = pair[dark ? 'dark' : 'light'].color['elevation.surface'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        theme={pair}
        colorMode={dark ? 'dark' : 'light'}
        motion={reduced ? 'reduced' : 'system'}
        haptics={haptics}
      >
        <StatusBar style={dark ? 'light' : 'dark'} />
        <SafeAreaView style={{ flex: 1, backgroundColor: surface }}>
          <Foundations
            brand={brand}
            setBrand={setBrand}
            dark={dark}
            setDark={setDark}
            reduced={reduced}
            setReduced={setReduced}
          />
        </SafeAreaView>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
