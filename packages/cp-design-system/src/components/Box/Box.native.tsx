import { View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/context';
import { boxStyle, type BoxProps } from './Box.types';

/** A themed container: spacing, color, border and radius from tokens. */
export function Box(props: BoxProps) {
  const theme = useTheme();
  return (
    <View testID={props.testID} style={{ ...boxStyle(theme, props), ...props.style } as ViewStyle}>
      {props.children}
    </View>
  );
}
