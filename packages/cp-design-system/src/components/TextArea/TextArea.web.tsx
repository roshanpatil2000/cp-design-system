import { useId, useLayoutEffect, useRef, useState } from 'react';
import { withoutUndefined, resolveTokens } from '../../theme/component';
import { useReducedMotion, useTheme } from '../../theme/context';
import { useMediaQuery } from '../../theme/useMediaQuery.web';
import { getTextFieldTokens } from '../TextField/TextField.tokens';
import { FieldLabel } from '../internal/FieldLabel.web';
import { FieldMessage } from '../internal/FieldMessage.web';
import { messageStyleOf, pickFieldMessage } from '../internal/fieldLabelStyle';
import { remainingText, textAreaPaddingY, type TextAreaProps } from './TextArea.types';

/** A multi-line text field that grows with its content, styled like TextField. */
export function TextArea(input: TextAreaProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const touch = useMediaQuery('(pointer: coarse) and (max-width: 640px)');
  const config = theme.components.TextArea;
  const props = { ...config?.defaultProps, ...withoutUndefined(input) } as TextAreaProps;
  const t = resolveTokens(
    getTextFieldTokens(theme, 'standard', false, touch),
    theme,
    config?.tokens,
    props.tokens,
  );
  const id = useId();
  const messageId = `${id}-message`;
  const ref = useRef<HTMLTextAreaElement>(null);
  const [internal, setInternal] = useState(props.defaultValue ?? '');
  const value = props.value ?? internal;
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const disabled = !!props.isDisabled;
  const padY = textAreaPaddingY(t);
  const rows = props.minimumRows ?? 3;
  const minHeight = rows * t.lineHeight + 2 * padY + 2 * t.borderWidth;
  const maxHeight = props.maxHeight ?? 240;
  const resize = props.resize ?? 'auto';

  // Grow with the content between the minimum rows and maxHeight.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || resize !== 'auto') return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(maxHeight, Math.max(minHeight, el.scrollHeight + 2 * t.borderWidth))}px`;
  }, [value, minHeight, maxHeight, resize, t.borderWidth]);

  const border = props.isInvalid
    ? t.borderInvalid
    : focused
      ? t.borderFocused
      : disabled
        ? t.borderDisabled
        : hovered
          ? t.borderHovered
          : t.border;
  // As in TextField: an inner ring when invalid (red) or focused (blue).
  const ring = disabled
    ? null
    : props.isInvalid
      ? t.borderInvalid
      : focused
        ? t.borderFocused
        : null;
  const background = disabled
    ? t.backgroundDisabled
    : focused
      ? t.backgroundFocused
      : hovered
        ? t.backgroundHovered
        : t.background;
  const message = pickFieldMessage(props);
  const counter = remainingText(props.maxCharacters, value.length);
  const transition = reduceMotion
    ? 'none'
    : 'background-color 150ms, border-color 150ms, box-shadow 150ms';

  return (
    <div
      data-testid={props.testID}
      style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
    >
      {props.label && (
        <FieldLabel label={props.label} isRequired={props.isRequired} htmlFor={id} t={t} />
      )}
      <textarea
        ref={ref}
        id={id}
        name={props.name}
        value={value}
        placeholder={props.placeholder}
        disabled={disabled}
        readOnly={props.isReadOnly}
        required={props.isRequired}
        maxLength={props.maxCharacters}
        rows={rows}
        aria-invalid={props.isInvalid || undefined}
        aria-describedby={message || counter ? messageId : undefined}
        onChange={(e) => {
          if (props.value === undefined) setInternal(e.target.value);
          props.onChange?.(e.target.value);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={{
          boxSizing: 'border-box',
          width: '100%',
          minHeight,
          maxHeight: resize === 'auto' ? maxHeight : undefined,
          margin: 0,
          padding: `${padY}px ${t.paddingX}px`,
          border: `${t.borderWidth}px solid ${border}`,
          borderRadius: t.radius,
          boxShadow: ring ? `inset 0 0 0 1px ${ring}` : 'none',
          background,
          color: disabled ? t.textDisabled : t.text,
          fontFamily: props.isMonospaced
            ? (t.monoFontFamily ?? 'monospace')
            : (t.fontFamily ?? 'inherit'),
          fontSize: t.fontSize,
          lineHeight: `${t.lineHeight}px`,
          resize: resize === 'vertical' ? 'vertical' : 'none',
          overflowY: 'auto',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : undefined,
          transition,
        }}
      />
      <div id={messageId} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <FieldMessage message={message} style={messageStyleOf(t)} />
        </div>
        {counter && (
          <span
            aria-live="polite"
            data-part="counter"
            style={{
              marginTop: 4,
              color:
                value.length >= (props.maxCharacters ?? Infinity) ? t.errorColor : t.helperColor,
              fontSize: t.messageFontSize,
              lineHeight: `${t.messageLineHeight}px`,
              fontFamily: t.fontFamily ?? 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            {counter}
          </span>
        )}
      </div>
    </div>
  );
}
