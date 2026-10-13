import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { resolveTokens, withoutUndefined } from '../../theme/component';
import { useTheme } from '../../theme/context';
import { getTextFieldTokens } from '../TextField/TextField.tokens';
import { FieldLabel } from '../internal/FieldLabel.native';
import { FieldMessage } from '../internal/FieldMessage.native';
import { messageStyleOf, pickFieldMessage } from '../internal/fieldLabelStyle';
import { remainingText, textAreaPaddingY, type TextAreaProps } from './TextArea.types';

/** A multi-line text field that grows with its content, styled like TextField. */
export function TextArea(input: TextAreaProps) {
  const theme = useTheme();
  const config = theme.components.TextArea;
  const props = { ...config?.defaultProps, ...withoutUndefined(input) } as TextAreaProps;
  const t = resolveTokens(
    getTextFieldTokens(theme, 'standard', false, true),
    theme,
    config?.tokens,
    props.tokens,
  );
  const [internal, setInternal] = useState(props.defaultValue ?? '');
  const value = props.value ?? internal;
  const [focused, setFocused] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const disabled = !!props.isDisabled;
  const padY = textAreaPaddingY(t);
  const rows = props.minimumRows ?? 3;
  const minHeight = rows * t.lineHeight + 2 * padY + 2 * t.borderWidth;
  const maxHeight = props.maxHeight ?? 240;
  const height = Math.min(
    maxHeight,
    Math.max(minHeight, contentHeight + 2 * padY + 2 * t.borderWidth),
  );
  const message = pickFieldMessage(props);
  const counter = remainingText(props.maxCharacters, value.length);
  const border = props.isInvalid
    ? t.borderInvalid
    : focused
      ? t.borderFocused
      : disabled
        ? t.borderDisabled
        : t.border;

  return (
    <View testID={props.testID} style={{ width: '100%' }}>
      {props.label ? <FieldLabel label={props.label} isRequired={props.isRequired} t={t} /> : null}
      <TextInput
        testID={props.testID && `${props.testID}-input`}
        accessibilityLabel={props.label}
        accessibilityState={{ disabled }}
        multiline
        textAlignVertical="top"
        {...(props.value !== undefined ? { value } : { defaultValue: props.defaultValue })}
        placeholder={props.placeholder}
        placeholderTextColor={disabled ? t.placeholderDisabled : t.placeholder}
        editable={!disabled && !props.isReadOnly}
        maxLength={props.maxCharacters}
        scrollEnabled={contentHeight + 2 * padY > maxHeight}
        onChangeText={(text) => {
          if (props.value === undefined) setInternal(text);
          props.onChange?.(text);
        }}
        onContentSizeChange={(e) => setContentHeight(e.nativeEvent.contentSize.height)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height,
          paddingHorizontal: t.paddingX,
          paddingTop: padY,
          paddingBottom: padY,
          borderWidth: focused ? t.borderWidth + 1 : t.borderWidth,
          borderColor: border,
          borderRadius: t.radius,
          backgroundColor: disabled
            ? t.backgroundDisabled
            : focused
              ? t.backgroundFocused
              : t.background,
          color: disabled ? t.textDisabled : t.text,
          fontFamily: props.isMonospaced ? t.monoFontFamily : t.fontFamily,
          fontSize: t.fontSize,
          lineHeight: t.lineHeight,
        }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <FieldMessage message={message} testID={props.testID} style={messageStyleOf(t)} />
        </View>
        {counter ? (
          <Text
            testID={props.testID && `${props.testID}-counter`}
            accessibilityLiveRegion="polite"
            style={{
              marginTop: 4,
              color:
                value.length >= (props.maxCharacters ?? Infinity) ? t.errorColor : t.helperColor,
              fontSize: t.messageFontSize,
              lineHeight: t.messageLineHeight,
              fontFamily: t.fontFamily,
            }}
          >
            {counter}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
