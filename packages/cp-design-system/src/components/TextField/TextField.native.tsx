import { useEffect } from 'react';
import { Platform, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { fontWeightFor } from '../../theme/createTheme';
import { mixColors } from '../../motion/worklet.native';
import { FieldMessage, fieldSettle } from '../internal/FieldMessage.native';
import { StatusIcon } from '../internal/StatusIcon.native';
import type { TextFieldProps, TextFieldType } from './TextField.types';
import { useTextField } from './useTextField';

const keyboards: Record<TextFieldType, KeyboardTypeOptions> = {
  text: 'default',
  email: 'email-address',
  password: 'default',
  number: 'numeric',
  tel: 'phone-pad',
  url: 'url',
  search: 'web-search',
};

export function TextField(input: TextFieldProps) {
  const f = useTextField(input, true);
  const { props, tokens: t, theme, reduceMotion } = f;
  const focused = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const disabled = !!props.isDisabled;
  const timing = { duration: reduceMotion ? 0 : 150, easing: Easing.bezier(0.4, 1, 0.6, 1) };

  useEffect(() => {
    if (!f.shakeKey || !f.animate) return;
    const d = t.shakeDistance;
    const step = (to: number) => withTiming(to, { duration: 50 });
    shakeX.value = withSequence(
      step(-d),
      step(d),
      step(-d * 0.6),
      step(d * 0.6),
      step(-d * 0.25),
      step(0),
    );
  }, [f.shakeKey, f.animate, t.shakeDistance, shakeX]);

  const rest = disabled ? t.backgroundDisabled : t.background;
  const focusBackground = disabled ? t.backgroundDisabled : t.backgroundFocused;
  const restBorder = disabled ? t.borderDisabled : f.isInvalid ? t.borderInvalid : t.border;
  const focusBorder = disabled ? t.borderDisabled : f.isInvalid ? t.borderInvalid : t.borderFocused;
  const ringColor = f.isInvalid ? t.borderInvalid : t.borderFocused;
  const alwaysRing = f.isInvalid && !disabled;

  const fieldStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      backgroundColor: mixColors(focused.value, [0, 1], [rest, focusBackground]),
      borderColor: mixColors(focused.value, [0, 1], [restBorder, focusBorder]),
      transform: [{ translateX: shakeX.value }],
    };
  });
  // Inner 1px ring: with the 1px border it makes Atlassian's 2px focus/invalid edge without moving content.
  const ringStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: alwaysRing ? 1 : focused.value };
  });

  const textColor = disabled ? t.textDisabled : t.text;
  const fontFamily = props.isMonospaced
    ? (t.monoFontFamily ?? Platform.select({ ios: 'Menlo', default: 'monospace' }))
    : t.fontFamily;
  const glyph = theme.color['color.icon.inverse'];
  const messageText = {
    fontSize: t.messageFontSize,
    lineHeight: t.messageLineHeight,
    fontFamily: t.fontFamily,
  };
  const type = props.type ?? 'text';
  const hint = [f.message?.text, f.counter?.text].filter(Boolean).join('. ') || undefined;

  return (
    <View testID={props.testID} style={{ width: '100%', maxWidth: f.width }}>
      {props.label ? (
        <Text
          style={{
            marginBottom: theme.space['050'],
            color: t.labelColor,
            fontSize: t.labelFontSize,
            lineHeight: t.labelLineHeight,
            fontWeight: fontWeightFor(t.labelFontWeight),
            fontFamily: t.fontFamily,
          }}
        >
          {props.label}
          {props.isRequired ? <Text style={{ color: t.requiredColor }}>{' *'}</Text> : null}
        </Text>
      ) : null}
      <Animated.View
        testID={props.testID && `${props.testID}-field`}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: t.borderWidth,
            borderWidth: props.appearance === 'none' ? 0 : t.borderWidth,
            borderRadius: t.radius,
          },
          fieldStyle,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: Math.max(0, t.radius - t.borderWidth),
              borderWidth: t.borderWidth,
              borderColor: disabled || props.appearance === 'none' ? 'transparent' : ringColor,
            },
            ringStyle,
          ]}
        />
        {props.elemBeforeInput ? (
          <View style={{ paddingLeft: t.paddingX }}>{props.elemBeforeInput}</View>
        ) : null}
        <TextInput
          testID={props.testID && `${props.testID}-input`}
          // Uncontrolled: let the native input own its text (no JS round-trip that could overwrite
          // fast input); we still track it for the counter. Controlled: follow the value prop.
          value={props.value}
          defaultValue={props.value === undefined ? props.defaultValue : undefined}
          onChangeText={f.setValue}
          onFocus={() => {
            focused.value = withTiming(1, timing);
            props.onFocus?.();
          }}
          onBlur={() => {
            focused.value = withTiming(0, timing);
            f.markTouched();
            props.onBlur?.();
          }}
          onSubmitEditing={props.onSubmit}
          placeholder={props.placeholder}
          placeholderTextColor={disabled ? t.placeholderDisabled : t.placeholder}
          editable={f.editable}
          secureTextEntry={type === 'password'}
          keyboardType={keyboards[type]}
          autoCapitalize={type === 'text' || type === 'search' ? undefined : 'none'}
          autoCorrect={type === 'text' || type === 'search' ? undefined : false}
          returnKeyType={type === 'search' ? 'search' : undefined}
          autoComplete={props.autoComplete as never}
          autoFocus={props.autoFocus}
          accessibilityLabel={props.label ?? props.accessibilityLabel}
          accessibilityHint={hint}
          accessibilityState={{ disabled }}
          aria-invalid={f.isInvalid}
          aria-required={props.isRequired}
          selectionColor={t.borderFocused}
          style={{
            flex: 1,
            minWidth: 0,
            height: t.lineHeight + 2 * f.paddingY,
            paddingVertical: 0,
            paddingHorizontal: t.paddingX,
            margin: 0,
            color: textColor,
            fontSize: t.fontSize,
            fontFamily,
            // Android adds extra font padding that would push the text off-centre.
            includeFontPadding: false,
            textAlignVertical: 'center',
          }}
        />
        {props.elemAfterInput ? (
          <View style={{ paddingRight: t.paddingX }}>{props.elemAfterInput}</View>
        ) : null}
      </Animated.View>
      <FieldMessage
        message={f.message}
        testID={props.testID}
        style={{
          helperColor: t.helperColor,
          errorColor: t.errorColor,
          validColor: t.validColor,
          fontSize: t.messageFontSize,
          lineHeight: t.messageLineHeight,
          fontFamily: t.fontFamily,
        }}
      />
      {f.counter ? (
        <Animated.View
          layout={reduceMotion ? undefined : fieldSettle}
          testID={props.testID && `${props.testID}-counter`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.space['075'],
            marginTop: theme.space['050'],
          }}
        >
          {f.counter.isError ? (
            <StatusIcon kind="error" size={12} color={t.errorColor} glyph={glyph} />
          ) : null}
          <Text style={{ ...messageText, color: f.counter.isError ? t.errorColor : t.helperColor }}>
            {f.counter.text}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
