import { useCallback, useRef, useState } from 'react';
import { resolveSpring, resolveTokens } from '../../theme/component';
import { useHaptics, useReducedMotion, useTheme } from '../../theme/context';
import { getToggleTokens } from './Toggle.tokens';
import type { ToggleProps } from './Toggle.types';

const withoutUndefined = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;

/**
 * Platform-independent Toggle behaviour: theme defaults, tokens, spring, and
 * controlled/uncontrolled state. Renderers call `commit(next)` after any interaction
 * (tap, drag, key, screen reader); `settleKey` changes after every commit so the
 * renderer can animate to the resulting state, even when a controlled parent rejects it.
 */
export function useToggle(input: ToggleProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const haptics = useHaptics();
  const config = theme.components.Toggle;
  const props = { ...config?.defaultProps, ...withoutUndefined(input) } as ToggleProps;

  const size = props.size ?? 'regular';
  const appearance = props.appearance ?? 'success';
  const tokens = resolveTokens(
    getToggleTokens(theme, size, appearance),
    theme,
    config?.tokens,
    props.tokens,
  );
  const spring = resolveSpring(theme, reduceMotion, 'snappy', props.motion, config?.motion);

  const [internal, setInternal] = useState(props.defaultChecked ?? false);
  const controlled = props.isChecked !== undefined;
  const checked = controlled ? !!props.isChecked : internal;
  const interactive = !props.isDisabled && !props.isLoading;
  const [settleKey, setSettleKey] = useState(0);

  const latest = useRef({ checked, interactive, controlled, onChange: props.onChange });
  latest.current = { checked, interactive, controlled, onChange: props.onChange };

  const commit = useCallback(
    (next: boolean) => {
      const {
        checked: current,
        interactive: canChange,
        controlled: isControlled,
        onChange,
      } = latest.current;
      if (canChange && next !== current) {
        if (!isControlled) setInternal(next);
        haptics('selection');
        onChange?.(next);
      }
      setSettleKey((k) => k + 1);
    },
    [haptics],
  );

  const toggle = useCallback(() => commit(!latest.current.checked), [commit]);

  return {
    props,
    size,
    tokens,
    spring,
    reduceMotion,
    checked,
    interactive,
    commit,
    toggle,
    settleKey,
  };
}
