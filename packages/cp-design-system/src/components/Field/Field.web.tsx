import { useId } from 'react';
import { useTheme } from '../../theme/context';
import { getTextFieldTokens } from '../TextField/TextField.tokens';
import { FieldLabel } from '../internal/FieldLabel.web';
import { FieldMessage } from '../internal/FieldMessage.web';
import { messageStyleOf, pickFieldMessage } from '../internal/fieldLabelStyle';
import type { FieldProps } from './Field.types';

/**
 * A form field wrapper: label, required marker, and an animated helper/error/valid message,
 * linked to your control for screen readers. Use it around any input that has no label of its own.
 */
export function Field(props: FieldProps) {
  const theme = useTheme();
  const t = getTextFieldTokens(theme, 'standard', false, false);
  const id = useId();
  const messageId = `${id}-message`;
  const message = pickFieldMessage(props);
  const field = {
    id,
    'aria-describedby': message ? messageId : undefined,
    'aria-invalid': props.isInvalid || undefined,
    'aria-required': props.isRequired || undefined,
    isInvalid: !!props.isInvalid,
    isRequired: !!props.isRequired,
    isDisabled: !!props.isDisabled,
  };
  return (
    <div data-testid={props.testID} style={{ display: 'flex', flexDirection: 'column' }}>
      <FieldLabel label={props.label} isRequired={props.isRequired} htmlFor={id} t={t} />
      {typeof props.children === 'function' ? props.children(field) : props.children}
      <FieldMessage message={message} id={messageId} style={messageStyleOf(t)} />
    </div>
  );
}
