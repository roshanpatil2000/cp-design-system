import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { springTo, timeTo } from '../../motion/worklet.native';
import { fontWeightFor } from '../../theme/createTheme';
import { useComponent } from '../../theme/useComponent';
import {
  avatarGeometry,
  avatarSizes,
  getAvatarTokens,
  initials,
  nameColors,
  presenceLabel,
  type AvatarProps,
} from './Avatar.types';

/** A picture of a person or project, falling back to colored initials. */
export function Avatar(input: AvatarProps) {
  const { theme, props, tokens: t, spring } = useComponent('Avatar', input, getAvatarTokens);
  const size = avatarSizes[props.size ?? 'medium'];
  const g = avatarGeometry(size, props.appearance ?? 'circle');
  const colors = nameColors(theme, props.name);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pressed, setPressed] = useState(false);
  const showImage = !!props.src && !failed;
  const label = props.presence ? `${props.name} (${presenceLabel[props.presence]})` : props.name;
  const presenceColor =
    props.presence &&
    {
      online: t.presenceOnline,
      busy: t.presenceBusy,
      focus: t.presenceFocus,
      offline: t.presenceOffline,
    }[props.presence];

  const imageOpacity = useSharedValue(0);
  const scale = useSharedValue(1);
  useEffect(() => {
    imageOpacity.value = spring ? timeTo(loaded ? 1 : 0, { duration: 200 }) : loaded ? 1 : 0;
  }, [loaded, spring, imageOpacity]);
  useEffect(() => {
    const to = pressed ? t.pressedScale : 1;
    scale.value = spring ? springTo(to, spring) : to;
  }, [pressed, spring, t.pressedScale, scale]);
  const imageStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: imageOpacity.value };
  });
  const scaleStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: scale.value }] };
  });

  const body = (
    <Animated.View
      style={[
        {
          width: size + 2 * t.ringWidth,
          height: size + 2 * t.ringWidth,
          padding: t.ringWidth,
          borderRadius: g.radius + t.ringWidth,
          backgroundColor: t.ring,
          opacity: props.isDisabled ? 0.5 : 1,
        },
        scaleStyle,
      ]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: g.radius,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.background ?? colors.background,
        }}
      >
        {!showImage || !loaded ? (
          <Text
            style={{
              color: t.text ?? colors.text,
              fontFamily: t.fontFamily,
              fontSize: g.fontSize,
              fontWeight: fontWeightFor(t.fontWeight),
            }}
          >
            {initials(props.name)}
          </Text>
        ) : null}
        {showImage ? (
          <Animated.Image
            testID={props.testID && `${props.testID}-image`}
            source={{ uri: props.src }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            style={[{ position: 'absolute', width: size, height: size }, imageStyle]}
          />
        ) : null}
      </View>
      {presenceColor ? (
        <View
          testID={props.testID && `${props.testID}-presence`}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: g.dot + t.ringWidth,
            height: g.dot + t.ringWidth,
            borderRadius: (g.dot + t.ringWidth) / 2,
            borderWidth: t.ringWidth,
            borderColor: t.ring,
            backgroundColor: presenceColor,
          }}
        />
      ) : null}
    </Animated.View>
  );

  return props.onPress ? (
    <Pressable
      testID={props.testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!props.isDisabled }}
      disabled={props.isDisabled}
      onPress={props.onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      hitSlop={size < 44 ? (44 - size) / 2 : 0}
    >
      {body}
    </Pressable>
  ) : (
    <View testID={props.testID} accessible accessibilityRole="image" accessibilityLabel={label}>
      {body}
    </View>
  );
}
