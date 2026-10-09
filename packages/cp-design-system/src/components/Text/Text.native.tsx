import { Text as RNText } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { getTextStyle } from './Text.styles';
import type { TextProps } from './Text.types';

export function Text(props: TextProps) {
  const theme = useTheme();
  const isHeading =
    props.variant === 'title' || props.variant === 'heading' || props.variant === 'subheading';
  return (
    <RNText
      testID={props.testID}
      numberOfLines={props.numberOfLines}
      accessibilityRole={isHeading ? 'header' : undefined}
      style={getTextStyle(props, theme)}
    >
      {props.children}
    </RNText>
  );
}
