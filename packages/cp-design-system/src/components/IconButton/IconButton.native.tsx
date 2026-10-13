import { withoutUndefined } from '../../theme/component';
import { useTheme } from '../../theme/context';
import { ButtonBase } from '../Button/Button.native';
import { Icon } from '../Icon/Icon.native';
import { iconButtonTokens, type IconButtonProps } from './IconButton.types';

/** A square (or round) button showing only an icon, with a required accessible label. */
export function IconButton(input: IconButtonProps) {
  const theme = useTheme();
  const props = {
    ...theme.components.IconButton?.defaultProps,
    ...withoutUndefined(input),
  } as IconButtonProps;
  const { icon } = props;
  return (
    <ButtonBase
      accessibilityLabel={props.label}
      accessibilityHint={props.accessibilityHint}
      onPress={props.onPress}
      appearance={props.appearance}
      spacing={props.spacing}
      isSelected={props.isSelected}
      isDisabled={props.isDisabled}
      isLoading={props.isLoading}
      motion={props.motion}
      testID={props.testID}
      tokens={iconButtonTokens(props)}
      iconBefore={({ color, size }) =>
        typeof icon === 'function' ? (
          icon({ color, size })
        ) : (
          <Icon glyph={icon} size={size} color={color} />
        )
      }
    />
  );
}
