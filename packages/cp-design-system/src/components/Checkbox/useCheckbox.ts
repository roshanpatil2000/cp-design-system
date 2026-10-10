import { useCallback, useRef, useState } from 'react';
import { resolveSpring, resolveTokens, withoutUndefined } from '../../theme/component';
import { useHaptics, useReducedMotion, useTheme } from '../../theme/context';
import { getCheckboxTokens } from './Checkbox.tokens';
import type { CheckboxProps } from './Checkbox.types';

/** Platform-independent Checkbox behaviour: theme defaults, tokens, spring and state. */
export function useCheckbox(input: CheckboxProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const haptics = useHaptics();
  const config = theme.components.Checkbox;
  const props = { ...config?.defaultProps, ...withoutUndefined(input) } as CheckboxProps;

  const tokens = resolveTokens(getCheckboxTokens(theme), theme, config?.tokens, props.tokens);
  const spring = resolveSpring(theme, reduceMotion, 'snappy', props.motion, config?.motion);

  const [internal, setInternal] = useState(props.defaultChecked ?? false);
  const controlled = props.isChecked !== undefined;
  const checked = controlled ? !!props.isChecked : internal;
  const indeterminate = !!props.isIndeterminate;
  const interactive = !props.isDisabled;

  const latest = useRef({ checked, indeterminate, interactive, controlled, props });
  latest.current = { checked, indeterminate, interactive, controlled, props };

  const toggle = useCallback(() => {
    const cur = latest.current;
    if (!cur.interactive) return;
    // From the mixed state a press always selects, like a native indeterminate checkbox.
    const next = cur.indeterminate ? true : !cur.checked;
    if (!cur.controlled) setInternal(next);
    haptics('selection');
    cur.props.onChange?.(next);
  }, [haptics]);

  return {
    props,
    tokens,
    spring,
    checked,
    indeterminate,
    /** Whether the control is filled: checked or indeterminate. */
    on: checked || indeterminate,
    interactive,
    toggle,
  };
}
