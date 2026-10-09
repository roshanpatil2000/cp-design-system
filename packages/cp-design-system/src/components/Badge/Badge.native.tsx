import { Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { getBadgeStyles } from './Badge.styles';
import type { BadgeProps } from './Badge.types';

export function Badge(props: BadgeProps) {
  const theme = useTheme();
  const { container, label } = getBadgeStyles(props, theme);
  return (
    <View testID={props.testID} style={container}>
      <Text style={label}>{props.children}</Text>
    </View>
  );
}
