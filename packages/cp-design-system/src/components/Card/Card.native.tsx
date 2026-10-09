import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { cardShadow, getCardStyle } from './Card.styles';
import type { CardProps } from './Card.types';

export function Card(props: CardProps) {
  const theme = useTheme();
  return (
    <View
      testID={props.testID}
      style={[getCardStyle(props, theme), props.elevated !== false && cardShadow.native]}
    >
      {props.children}
    </View>
  );
}
