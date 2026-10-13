import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { Keyframe } from 'react-native-reanimated';
import { useComponent } from '../../theme/useComponent';
import { Icon } from '../Icon/Icon.native';
import { getTagTokens, type TagProps } from './Tag.types';

const shrinkAway = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 0.8 }] },
}).duration(150);

/** A label for categorizing, filtering or showing selections. Removable tags shrink away. */
export function Tag(input: TagProps) {
  const { props, tokens: t, spring } = useComponent('Tag', input, getTagTokens);
  const [removed, setRemoved] = useState(false);
  const [pressed, setPressed] = useState(false);
  const remove = () => {
    setRemoved(true);
    // The exiting animation runs on the UI thread; report removal once it has had time to play.
    if (spring) setTimeout(() => props.onRemove?.(), 150);
    else props.onRemove?.();
  };
  return (
    // Sizes to content in columns without pinning to the top of a centered row. It stays mounted
    // so the tag inside can play its exit animation.
    <View style={{ flexDirection: 'row' }}>
      {removed ? null : (
        <Animated.View
          testID={props.testID}
          exiting={spring ? shrinkAway : undefined}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: t.height,
            maxWidth: t.maxWidth,
            paddingLeft: t.paddingX,
            paddingRight: props.isRemovable ? 0 : t.paddingX,
            borderRadius: t.radius,
            backgroundColor: pressed ? t.removeHovered : t.background,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              flexShrink: 1,
              color: t.text,
              fontFamily: t.fontFamily,
              fontSize: t.fontSize,
              lineHeight: t.lineHeight,
            }}
          >
            {props.text}
          </Text>
          {props.isRemovable ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={props.removeButtonLabel ?? `Remove ${props.text}`}
              testID={props.testID && `${props.testID}-remove`}
              hitSlop={8}
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
              onPress={remove}
              style={{
                width: t.height,
                height: t.height,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon glyph="cross" size={10} color={t.text} />
            </Pressable>
          ) : null}
        </Animated.View>
      )}
    </View>
  );
}
