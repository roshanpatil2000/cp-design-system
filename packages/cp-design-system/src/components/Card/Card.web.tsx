import { useTheme } from '../../theme/ThemeProvider';
import { cardShadow, getCardStyle } from './Card.styles';
import type { CardProps } from './Card.types';

export function Card(props: CardProps) {
  const theme = useTheme();
  return (
    <div
      data-testid={props.testID}
      style={{
        display: 'flex',
        boxSizing: 'border-box',
        ...getCardStyle(props, theme),
        boxShadow: props.elevated === false ? undefined : cardShadow.web,
      }}
    >
      {props.children}
    </div>
  );
}
