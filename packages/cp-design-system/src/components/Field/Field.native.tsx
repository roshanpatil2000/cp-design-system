import { View } from 'react-native';
import { useTheme } from '../../theme/context';
import { getTextFieldTokens } from '../TextField/TextField.tokens';
import { FieldLabel } from '../internal/FieldLabel.native';
import { FieldMessage } from '../internal/FieldMessage.native';
import { messageStyleOf, pickFieldMessage } from '../internal/fieldLabelStyle';
import type { FieldProps } from './Field.types';

/**
 * A form field wrapper: label, required marker, and an animated helper/error/valid message.
 * Use it around any control that has no label of its own.
 */
export function Field(props: FieldProps) {
  const theme = useTheme();
  const t = getTextFieldTokens(theme, 'standard', false, true);
  const message = pickFieldMessage(props);
  const field = {
    id: props.testID ?? props.label,
    isInvalid: !!props.isInvalid,
    isRequired: !!props.isRequired,
    isDisabled: !!props.isDisabled,
  };
  return (
    <View testID={props.testID}>
      <FieldLabel label={props.label} isRequired={props.isRequired} t={t} />
      {typeof props.children === 'function' ? props.children(field) : props.children}
      <FieldMessage message={message} testID={props.testID} style={messageStyleOf(t)} />
    </View>
  );
}
