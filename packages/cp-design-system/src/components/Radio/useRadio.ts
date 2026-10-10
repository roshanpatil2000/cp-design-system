import { useCallback, useRef, useState } from 'react';
import { resolveSpring, resolveTokens, withoutUndefined } from '../../theme/component';
import { useHaptics, useReducedMotion, useTheme } from '../../theme/context';
import { getRadioTokens } from './Radio.tokens';
import type { RadioGroupProps, RadioProps } from './Radio.types';

export function useRadio(input: RadioProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const haptics = useHaptics();
  const config = theme.components.Radio;
  const props = { ...config?.defaultProps, ...withoutUndefined(input) } as RadioProps;
  const tokens = resolveTokens(getRadioTokens(theme), theme, config?.tokens, props.tokens);
  const spring = resolveSpring(theme, reduceMotion, 'snappy', props.motion, config?.motion);
  const checked = !!props.isChecked;

  const latest = useRef(props);
  latest.current = props;
  const select = useCallback(() => {
    const p = latest.current;
    if (p.isDisabled || p.isChecked) return;
    haptics('selection');
    p.onChange?.(p.value);
  }, [haptics]);

  return { props, tokens, spring, checked, select };
}

export function useRadioGroup(input: RadioGroupProps) {
  const theme = useTheme();
  const props = {
    ...theme.components.RadioGroup?.defaultProps,
    ...withoutUndefined(input),
  } as RadioGroupProps;
  const [internal, setInternal] = useState(props.defaultValue ?? null);
  const controlled = props.value !== undefined;
  const value = controlled ? (props.value ?? null) : internal;

  const latest = useRef({ controlled, onChange: props.onChange });
  latest.current = { controlled, onChange: props.onChange };
  const select = useCallback((next: string) => {
    if (!latest.current.controlled) setInternal(next);
    latest.current.onChange?.(next);
  }, []);

  return { props, value, select };
}
