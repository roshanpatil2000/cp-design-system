import { Text } from 'react-native';
import Animated, { Easing, Keyframe, LinearTransition } from 'react-native-reanimated';
import { useReducedMotion, useTheme } from '../../theme/context';
import {
  messageIconKind,
  resolveFieldMessageStyle,
  type FieldMessageStyle,
  type FieldMessageValue,
} from './fieldMessageStyle';
import { StatusIcon } from './StatusIcon.native';

// Atlassian's form message motion: in = 150ms slide up 2px + fade; out = 100ms reverse.
const messageIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 2 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }], easing: Easing.bezier(0.4, 1, 0.6, 1) },
}).duration(150);
const messageOut = new Keyframe({
  0: { opacity: 1, transform: [{ translateY: 0 }] },
  100: { opacity: 0, transform: [{ translateY: 2 }], easing: Easing.bezier(0.6, 0, 0.8, 0.6) },
}).duration(100);
export const fieldSettle = LinearTransition.duration(150);

/** Helper / error / valid message under a field, with Atlassian's form message motion. */
export function FieldMessage({
  message,
  testID,
  style,
}: {
  message: FieldMessageValue | null;
  testID?: string;
  style?: FieldMessageStyle;
}) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  if (!message) return null;
  const s = resolveFieldMessageStyle(theme, style);
  const color =
    message.kind === 'error'
      ? s.errorColor
      : message.kind === 'valid'
        ? s.validColor
        : s.helperColor;
  const icon = messageIconKind[message.kind];
  return (
    <Animated.View
      key={`${message.kind}:${message.text}`}
      entering={reduceMotion ? undefined : messageIn}
      exiting={reduceMotion ? undefined : messageOut}
      layout={reduceMotion ? undefined : fieldSettle}
      testID={testID && `${testID}-message-${message.kind}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space['075'],
        marginTop: theme.space['050'],
      }}
    >
      {icon ? <StatusIcon kind={icon} size={12} color={color} glyph={s.glyph} /> : null}
      <Text
        style={{
          color,
          fontSize: s.fontSize,
          lineHeight: s.lineHeight,
          fontFamily: s.fontFamily,
          flexShrink: 1,
        }}
      >
        {message.text}
      </Text>
    </Animated.View>
  );
}
