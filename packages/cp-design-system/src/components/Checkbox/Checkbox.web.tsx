import { useEffect, useRef, useState } from 'react';
import { motion, type Transition } from 'motion/react';
import { checkMarkLayout, controlColors } from './Checkbox.tokens';
import type { CheckboxProps } from './Checkbox.types';
import { useCheckbox } from './useCheckbox';

/** Hides the real input but keeps it focusable and in the accessibility tree. */
export const visuallyHidden = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  margin: 0,
  opacity: 0,
  cursor: 'inherit',
} as const;

export function Checkbox(input: CheckboxProps) {
  const { props, tokens: t, spring, checked, indeterminate, on, toggle } = useCheckbox(input);
  const ref = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const disabled = !!props.isDisabled;
  const colors = controlColors(t, {
    on,
    disabled,
    invalid: !!props.isInvalid,
    hovered,
    pressed,
  });
  const mark = checkMarkLayout(t.size, t.borderWidth);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const color: Transition = spring ? { duration: 0.15 } : { duration: 0 };
  const pop: Transition = spring ? { type: 'spring', ...spring } : { duration: 0 };

  return (
    <label
      data-testid={props.testID}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: t.gap,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        lineHeight: `${t.lineHeight}px`,
        color: disabled ? t.labelDisabled : t.label,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: t.hitSize,
          height: Math.max(t.hitSize, t.lineHeight),
        }}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          required={props.isRequired}
          aria-invalid={props.isInvalid || undefined}
          aria-checked={indeterminate ? 'mixed' : checked}
          name={props.name}
          value={props.value ?? 'on'}
          onChange={toggle}
          onFocus={(e) => setFocusVisible(e.currentTarget.matches?.(':focus-visible') ?? true)}
          onBlur={() => setFocusVisible(false)}
          style={visuallyHidden}
        />
        <motion.span
          aria-hidden
          data-part="box"
          initial={false}
          animate={{
            backgroundColor: colors.fill,
            borderColor: colors.border,
            scale: pressed && spring ? t.pressedScale : 1,
          }}
          transition={{ backgroundColor: color, borderColor: color, scale: pop }}
          style={{
            position: 'relative',
            boxSizing: 'border-box',
            width: t.size,
            height: t.size,
            borderRadius: t.radius,
            borderWidth: t.borderWidth,
            borderStyle: 'solid',
            pointerEvents: 'none',
            outline: focusVisible ? `${t.focusRingWidth}px solid ${t.focusRing}` : 'none',
            outlineOffset: 1,
          }}
        >
          <motion.span
            data-part="tick"
            initial={false}
            animate={{
              opacity: checked && !indeterminate ? 1 : 0,
              scale: checked && !indeterminate ? 1 : 0.3,
            }}
            transition={pop}
            style={{
              position: 'absolute',
              ...mark.tick,
              boxSizing: 'border-box',
              borderStyle: 'solid',
              borderColor: colors.mark,
              borderWidth: `0 ${mark.stroke}px ${mark.stroke}px 0`,
              rotate: 45,
            }}
          />
          <motion.span
            data-part="dash"
            initial={false}
            animate={{ opacity: indeterminate ? 1 : 0, scaleX: indeterminate ? 1 : 0 }}
            transition={pop}
            style={{
              position: 'absolute',
              ...mark.dash,
              borderRadius: mark.stroke,
              background: colors.mark,
            }}
          />
        </motion.span>
      </span>
      <span style={{ paddingBlock: Math.max(0, (t.hitSize - t.lineHeight) / 2) }}>
        {props.label}
        {props.isRequired && (
          <span aria-hidden style={{ color: t.required, paddingInlineStart: 2 }}>
            *
          </span>
        )}
      </span>
    </label>
  );
}
