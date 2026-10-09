import { useCallback, useRef } from 'react';
import { resolveSpring, resolveTokens } from '../../theme/component';
import { useHaptics, useReducedMotion, useTheme } from '../../theme/context';
import { getButtonTokens } from './Button.tokens';
import type { ButtonIcon, ButtonProps } from './Button.types';

const withoutUndefined = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;

/** Platform-independent Button behaviour: theme defaults, tokens, spring and press handling. */
export function useButton(input: ButtonProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const haptics = useHaptics();
  const config = theme.components.Button;
  const props = { ...config?.defaultProps, ...withoutUndefined(input) } as ButtonProps;

  const appearance = props.appearance ?? 'default';
  const spacing = props.spacing ?? 'default';
  const isSelected = !!props.isSelected;
  const isDisabled = !!props.isDisabled;
  const isLoading = !!props.isLoading;
  const tokens = resolveTokens(
    getButtonTokens(theme, appearance, spacing, isSelected),
    theme,
    config?.tokens,
    props.tokens,
  );
  const spring = resolveSpring(theme, reduceMotion, 'snappy', props.motion, config?.motion);
  const interactive = !isDisabled && !isLoading;

  // Colors for the current state (hover and pressed are layered on by each renderer).
  const textColor = isDisabled ? tokens.textDisabled : tokens.text;
  const background = isDisabled ? tokens.backgroundDisabled : tokens.background;
  const borderColor = isDisabled ? tokens.borderDisabled : tokens.border;

  const latest = useRef({ interactive, onPress: props.onPress });
  latest.current = { interactive, onPress: props.onPress };

  const press = useCallback(() => {
    if (!latest.current.interactive) return;
    haptics('impactLight');
    latest.current.onPress?.();
  }, [haptics]);

  const renderIcon = (icon: ButtonIcon | undefined) =>
    typeof icon === 'function' ? icon({ color: textColor, size: tokens.iconSize }) : icon;

  return {
    props,
    tokens,
    spring,
    reduceMotion,
    theme,
    isSelected,
    isDisabled,
    isLoading,
    interactive,
    textColor,
    background,
    borderColor,
    press,
    renderIcon,
  };
}
