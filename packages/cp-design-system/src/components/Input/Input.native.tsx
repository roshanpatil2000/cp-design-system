import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { getInputStyles } from './Input.styles';
import type { InputProps } from './Input.types';

const keyboardTypes = {
  default: 'default',
  email: 'email-address',
  number: 'numeric',
  phone: 'phone-pad',
} as const;

export function Input(props: InputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const styles = getInputStyles(props, theme, focused);
  const message = props.error ?? props.helperText;

  return (
    <View>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      <TextInput
        testID={props.testID}
        value={props.value}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        placeholderTextColor={styles.placeholderColor}
        editable={!props.disabled}
        secureTextEntry={props.secureTextEntry}
        keyboardType={keyboardTypes[props.keyboardType ?? 'default']}
        autoCapitalize={props.keyboardType === 'email' ? 'none' : undefined}
        accessibilityLabel={props.label}
        accessibilityHint={message}
        onChangeText={props.onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.field}
      />
      {message && <Text style={styles.helper}>{message}</Text>}
    </View>
  );
}
