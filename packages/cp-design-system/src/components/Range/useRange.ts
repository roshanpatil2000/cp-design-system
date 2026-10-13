import { useCallback, useRef, useState } from 'react';
import { useComponent } from '../../theme/useComponent';
import { useHaptics } from '../../theme/context';
import { clampToStep, getRangeTokens, type RangeProps } from './Range.types';

export function useRange(input: RangeProps) {
  const { props, tokens, spring } = useComponent('Range', input, getRangeTokens);
  const haptics = useHaptics();
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;
  const [internal, setInternal] = useState(props.defaultValue ?? min);
  const value = clampToStep(props.value ?? internal, min, max, step);
  const fraction = max === min ? 0 : (value - min) / (max - min);

  const latest = useRef({ props, value, min, max, step });
  latest.current = { props, value, min, max, step };

  /** Commits a raw value (snapped to the step); fires onChange only when it changes. */
  const set = useCallback(
    (raw: number) => {
      const l = latest.current;
      if (l.props.isDisabled) return;
      const next = clampToStep(raw, l.min, l.max, l.step);
      if (next === l.value) return;
      latest.current.value = next;
      if (l.props.value === undefined) setInternal(next);
      haptics('selection');
      l.props.onChange?.(next);
    },
    [haptics],
  );

  const setFraction = useCallback(
    (f: number) => {
      const l = latest.current;
      set(l.min + Math.min(1, Math.max(0, f)) * (l.max - l.min));
    },
    [set],
  );

  return {
    props,
    tokens,
    spring,
    min,
    max,
    step,
    value,
    fraction,
    set,
    setFraction,
    valueText: props.formatValue?.(value) ?? String(value),
    disabled: !!props.isDisabled,
  };
}
