import { Text as RNText } from 'react-native';
import { fontWeightFor } from '../../theme/createTheme';
import { useTheme } from '../../theme/context';
import { textStyle, type TextProps } from './Text.types';

/** Body text in Atlassian's type scale and theme colors. */
export function Text(props: TextProps) {
  const theme = useTheme();
  const s = textStyle(theme, props);
  return (
    <RNText
      testID={props.testID}
      numberOfLines={props.maxLines}
      style={{ ...s, fontWeight: fontWeightFor(s.fontWeight) }}
    >
      {props.children}
    </RNText>
  );
}
