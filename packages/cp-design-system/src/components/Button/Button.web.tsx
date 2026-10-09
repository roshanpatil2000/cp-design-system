import { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { getButtonStyles } from './Button.styles';
import type { ButtonProps } from './Button.types';

export function Button(props: ButtonProps) {
  const theme = useTheme();
  const [pressed, setPressed] = useState(false);
  const { container, label } = getButtonStyles(props, theme, pressed);

  return (
    <button
      type="button"
      data-testid={props.testID}
      aria-label={props.accessibilityLabel}
      disabled={props.disabled}
      onClick={props.onPress}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: 'inline-flex',
        boxSizing: 'border-box',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        transition: 'opacity 120ms ease',
        ...container,
        ...label,
        lineHeight: `${label.lineHeight}px`,
      }}
    >
      {props.children}
    </button>
  );
}
