import { useEffect, useRef, useState } from 'react';
import { resolveSpring, resolveTokens } from '../../theme/component';
import { useReducedMotion, useTheme } from '../../theme/context';
import { getTextFieldTokens, textFieldPaddingY, textFieldWidths } from './TextField.tokens';
import type { TextFieldProps } from './TextField.types';

const withoutUndefined = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;

const plural = (n: number) => (n === 1 ? 'character' : 'characters');

export interface CounterState {
  text: string;
  /** `tooShort` and `tooLong` violate the limits; `ok` is within them. */
  status: 'ok' | 'tooShort' | 'tooLong';
}

/** Atlassian's character counter wording. Returns null when there's nothing to show. */
export function characterCounter(length: number, min?: number, max?: number): CounterState | null {
  if (min !== undefined && length < min) {
    const needed = min - length;
    return { text: `${needed} more ${plural(needed)} needed`, status: 'tooShort' };
  }
  if (max !== undefined && length > max) {
    const over = length - max;
    return { text: `${over} ${plural(over)} too many`, status: 'tooLong' };
  }
  if (max !== undefined) {
    const remaining = max - length;
    return { text: `${remaining} ${plural(remaining)} remaining`, status: 'ok' };
  }
  return null;
}

export type MessageKind = 'helper' | 'error' | 'valid';

/**
 * Platform-independent TextField behaviour: theme defaults, tokens, controlled/uncontrolled text,
 * the message and counter to show, and when to shake.
 * `touch` selects Atlassian's phone sizing (always on native; narrow touch screens on the web).
 */
export function useTextField(input: TextFieldProps, touch: boolean) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const config = theme.components.TextField;
  const props = { ...config?.defaultProps, ...withoutUndefined(input) } as TextFieldProps;

  const appearance = props.appearance ?? 'standard';
  const tokens = resolveTokens(
    getTextFieldTokens(theme, appearance, !!props.isCompact, touch),
    theme,
    config?.tokens,
    props.tokens,
  );
  const spring = resolveSpring(theme, reduceMotion, 'snappy', props.motion, config?.motion);
  const animate = !!spring && tokens.shakeDistance > 0;

  const [internal, setInternal] = useState(props.defaultValue ?? '');
  const controlled = props.value !== undefined;
  const value = controlled ? props.value! : internal;
  const editable = !props.isDisabled && !props.isReadOnly;

  const setValue = (text: string) => {
    if (!editable) return;
    if (!controlled) setInternal(text);
    props.onChange?.(text);
  };

  // An untouched field isn't flagged for being too short; the user hasn't had a chance yet.
  // Like Atlassian's form, "too few" becomes an error once the user leaves the field.
  const [touched, setTouched] = useState(false);
  const markTouched = () => setTouched(true);

  const count = characterCounter(value.length, props.minCharacters, props.maxCharacters);
  const counter = count && {
    text: count.text,
    isError: count.status === 'tooLong' || (count.status === 'tooShort' && touched),
  };
  const isInvalid = !!props.isInvalid || !!counter?.isError;

  let message: { kind: MessageKind; text: string } | null = null;
  if (props.isInvalid && props.errorMessage) message = { kind: 'error', text: props.errorMessage };
  else if (!props.isInvalid && props.validMessage)
    message = { kind: 'valid', text: props.validMessage };
  else if (props.helperMessage) message = { kind: 'helper', text: props.helperMessage };

  // Shake when the field becomes invalid, or when the error message changes while invalid.
  const [shakeKey, setShakeKey] = useState(0);
  const previous = useRef({ isInvalid, error: props.errorMessage });
  useEffect(() => {
    const before = previous.current;
    if (
      isInvalid &&
      (!before.isInvalid || (props.isInvalid && before.error !== props.errorMessage))
    ) {
      setShakeKey((k) => k + 1);
    }
    previous.current = { isInvalid, error: props.errorMessage };
  }, [isInvalid, props.isInvalid, props.errorMessage]);

  const width =
    props.width === undefined
      ? undefined
      : typeof props.width === 'number'
        ? props.width
        : textFieldWidths[props.width];

  return {
    props,
    tokens,
    theme,
    reduceMotion,
    animate,
    value,
    setValue,
    markTouched,
    editable,
    isInvalid,
    counter,
    message,
    shakeKey,
    width,
    paddingY: textFieldPaddingY(tokens),
  };
}
