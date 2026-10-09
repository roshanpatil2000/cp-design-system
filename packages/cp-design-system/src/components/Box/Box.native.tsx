import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { getBoxStyle } from './Box.styles';
import type { BoxProps } from './Box.types';

export function Box(props: BoxProps) {
  const theme = useTheme();
  return (
    <View testID={props.testID} style={getBoxStyle(props, theme)}>
      {props.children}
    </View>
  );
}
