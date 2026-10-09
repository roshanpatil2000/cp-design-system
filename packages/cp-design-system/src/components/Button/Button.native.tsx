import { Pressable, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { getButtonStyles } from './Button.styles';
import type { ButtonProps } from './Button.types';

export function Button(props: ButtonProps) {
  const theme = useTheme();
  const { label } = getButtonStyles(props, theme);

  return (
    <Pressable
      testID={props.testID}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      accessibilityState={{ disabled: !!props.disabled }}
      disabled={props.disabled}
      onPress={props.onPress}
      style={({ pressed }) => getButtonStyles(props, theme, pressed).container}
    >
      <Text style={label}>{props.children}</Text>
    </Pressable>
  );
}
