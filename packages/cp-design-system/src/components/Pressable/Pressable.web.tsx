import { useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import {
  getPressableTokens,
  pressableBackground,
  type PressableProps,
  type PressableState,
} from './Pressable.types';

/**
 * An unstyled button with the system's press, hover and focus treatment: a background that
 * follows the interaction, a spring squish while pressed and a focus ring for keyboard users.
 * Build custom tappable cards, rows and icon buttons on it.
 */
export function Pressable(input: PressableProps) {
  const { theme, props, tokens: t, spring } = useComponent('Pressable', input, getPressableTokens);
  const [state, setState] = useState<PressableState>({
    hovered: false,
    pressed: false,
    focused: false,
  });
  const set = (patch: Partial<PressableState>) => setState((s) => ({ ...s, ...patch }));
  const disabled = !!props.isDisabled;
  const content = typeof props.children === 'function' ? props.children(state) : props.children;

  return (
    <motion.button
      type="button"
      role={props.role === 'link' ? 'link' : undefined}
      aria-label={props.accessibilityLabel}
      disabled={disabled}
      data-testid={props.testID}
      onClick={() => !disabled && props.onPress?.()}
      onPointerEnter={() => set({ hovered: true })}
      onPointerLeave={() => set({ hovered: false, pressed: false })}
      onPointerDown={() => !disabled && set({ pressed: true })}
      onPointerUp={() => set({ pressed: false })}
      onFocus={(e) => set({ focused: e.currentTarget.matches?.(':focus-visible') ?? true })}
      onBlur={() => set({ focused: false })}
      initial={false}
      animate={{
        backgroundColor: pressableBackground(
          t,
          disabled ? { ...state, hovered: false, pressed: false } : state,
        ),
        scale: state.pressed && spring ? t.pressedScale : 1,
      }}
      transition={{
        backgroundColor: { duration: spring ? 0.15 : 0 },
        scale: spring ? { type: 'spring', ...spring } : { duration: 0 },
      }}
      style={
        {
          display: 'inline-flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          margin: 0,
          padding: props.padding ? theme.space[props.padding] : 0,
          border: 'none',
          borderRadius: t.radius,
          font: 'inherit',
          color: 'inherit',
          textAlign: 'inherit',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? t.disabledOpacity : 1,
          outline: state.focused ? `${t.focusRingWidth}px solid ${t.focusRing}` : 'none',
          outlineOffset: 2,
          WebkitTapHighlightColor: 'transparent',
          ...props.style,
        } as CSSProperties
      }
    >
      {content}
    </motion.button>
  );
}
