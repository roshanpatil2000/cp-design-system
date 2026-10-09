import { useId, useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { getInputStyles } from './Input.styles';
import type { InputProps } from './Input.types';

const inputTypes = { default: 'text', email: 'email', number: 'number', phone: 'tel' } as const;

export function Input(props: InputProps) {
  const theme = useTheme();
  const id = useId();
  const [focused, setFocused] = useState(false);
  const styles = getInputStyles(props, theme, focused);
  const message = props.error ?? props.helperText;
  const messageId = message ? `${id}-message` : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {props.label && (
        <label htmlFor={id} style={{ ...styles.label, lineHeight: `${styles.label.lineHeight}px` }}>
          {props.label}
        </label>
      )}
      <input
        id={id}
        data-testid={props.testID}
        type={props.secureTextEntry ? 'password' : inputTypes[props.keyboardType ?? 'default']}
        value={props.value}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        disabled={props.disabled}
        aria-invalid={!!props.error}
        aria-describedby={messageId}
        onChange={(e) => props.onChangeText?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...styles.field, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
      />
      {message && (
        <span
          id={messageId}
          style={{ ...styles.helper, lineHeight: `${styles.helper.lineHeight}px` }}
        >
          {message}
        </span>
      )}
    </div>
  );
}
