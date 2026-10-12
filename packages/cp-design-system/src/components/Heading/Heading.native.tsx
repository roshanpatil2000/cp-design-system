import { Text } from 'react-native';
import { fontWeightFor } from '../../theme/createTheme';
import { useTheme } from '../../theme/context';
import { headingStyle, type HeadingProps } from './Heading.types';

/** A heading in Atlassian's type scale, exposed to screen readers as a header. */
export function Heading(props: HeadingProps) {
  const theme = useTheme();
  const s = headingStyle(theme, props);
  return (
    <Text
      accessibilityRole="header"
      testID={props.testID}
      numberOfLines={props.maxLines}
      style={{ ...s, fontWeight: fontWeightFor(s.fontWeight) }}
    >
      {props.children}
    </Text>
  );
}
