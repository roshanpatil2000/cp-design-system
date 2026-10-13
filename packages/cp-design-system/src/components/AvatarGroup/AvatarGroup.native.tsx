import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { Keyframe } from 'react-native-reanimated';
import { fontWeightFor } from '../../theme/createTheme';
import { useReducedMotion, useTheme } from '../../theme/context';
import { Avatar } from '../Avatar/Avatar.native';
import { avatarGeometry, avatarSizes, getAvatarTokens } from '../Avatar/Avatar.types';
import { STACK_OVERLAP, splitGroup, type AvatarGroupProps } from './AvatarGroup.types';

const popIn = (delay: number) =>
  new Keyframe({
    0: { opacity: 0, transform: [{ scale: 0.6 }] },
    100: { opacity: 1, transform: [{ scale: 1 }] },
  })
    .duration(220)
    .delay(delay);

/** A row of avatars. The "+N" button expands the group and the new avatars pop in one by one. */
export function AvatarGroup(input: AvatarGroupProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const props = { ...theme.components.AvatarGroup?.defaultProps, ...input } as AvatarGroupProps;
  const [expanded, setExpanded] = useState(false);
  const sizeName = props.size ?? 'medium';
  const size = avatarSizes[sizeName];
  const stack = (props.appearance ?? 'stack') === 'stack';
  const { shown, hidden } = splitGroup(props.data, props.maxCount ?? 5, expanded);
  const t = getAvatarTokens(theme);
  const g = avatarGeometry(size, 'circle');
  const overlap = stack ? -Math.round(size * STACK_OVERLAP) : 0;
  const initialCount = Math.max(1, (props.maxCount ?? 5) - 1);

  return (
    <View
      testID={props.testID}
      accessibilityLabel={props.label ?? 'People'}
      style={{
        flexDirection: 'row',
        flexWrap: stack ? 'nowrap' : 'wrap',
        alignItems: 'center',
        gap: stack ? 0 : 8,
      }}
    >
      {shown.map((p, i) => (
        <Animated.View
          key={p.key ?? p.name}
          entering={reduceMotion || i < initialCount ? undefined : popIn((i - initialCount) * 40)}
          style={{ marginLeft: i === 0 ? 0 : overlap, zIndex: shown.length - i }}
        >
          <Avatar
            name={p.name}
            src={p.src}
            presence={p.presence}
            onPress={p.onPress}
            size={sizeName}
          />
        </Animated.View>
      ))}
      {hidden > 0 ? (
        <Pressable
          testID={props.testID && `${props.testID}-more`}
          accessibilityRole="button"
          accessibilityLabel={`Show ${hidden} more`}
          onPress={() => (props.onMorePress ? props.onMorePress() : setExpanded(true))}
          style={{
            marginLeft: overlap,
            width: size + 2 * t.ringWidth,
            height: size + 2 * t.ringWidth,
            borderRadius: g.radius + t.ringWidth,
            borderWidth: t.ringWidth,
            borderColor: t.ring,
            backgroundColor: theme.color['color.background.neutral'],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: theme.color['color.text'],
              fontFamily: theme.fontFamily.body,
              fontSize: g.fontSize * 0.9,
              fontWeight: fontWeightFor(500),
            }}
          >
            +{hidden}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
