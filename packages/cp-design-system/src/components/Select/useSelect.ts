import { useCallback, useRef, useState } from 'react';
import { resolveSpring, resolveTokens, withoutUndefined } from '../../theme/component';
import { useHaptics, useReducedMotion, useTheme } from '../../theme/context';
import { getTextFieldTokens } from '../TextField/TextField.tokens';
import { pickFieldMessage } from '../internal/fieldLabelStyle';
import type { SelectProps } from './Select.types';

export function useSelect(input: SelectProps, touch: boolean) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const haptics = useHaptics();
  const config = theme.components.Select;
  const props = { ...config?.defaultProps, ...withoutUndefined(input) } as SelectProps;
  const tokens = resolveTokens(
    getTextFieldTokens(theme, 'standard', false, touch),
    theme,
    config?.tokens,
    props.tokens,
  );
  const spring = resolveSpring(theme, reduceMotion, 'snappy', props.motion, config?.motion);
  const [internal, setInternal] = useState(props.defaultValue ?? null);
  const value = props.value !== undefined ? props.value : internal;
  const [open, setOpen] = useState(false);
  const selected = props.options.find((o) => o.value === value) ?? null;

  const latest = useRef(props);
  latest.current = props;
  const select = useCallback(
    (next: string) => {
      const p = latest.current;
      if (p.value === undefined) setInternal(next);
      haptics('selection');
      p.onChange?.(next);
    },
    [haptics],
  );

  return {
    theme,
    props,
    tokens,
    spring,
    value,
    selected,
    open,
    setOpen,
    select,
    disabled: !!props.isDisabled,
    message: pickFieldMessage(props),
    placeholder: props.placeholder ?? 'Select…',
  };
}
