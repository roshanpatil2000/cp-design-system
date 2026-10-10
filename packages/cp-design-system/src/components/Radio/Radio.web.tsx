import { useId, useState } from 'react';
import { motion, type Transition } from 'motion/react';
import { visuallyHidden } from '../Checkbox/Checkbox.web';
import { controlColors } from '../Checkbox/Checkbox.tokens';
import type { RadioGroupProps, RadioProps } from './Radio.types';
import { useRadio, useRadioGroup } from './useRadio';

export function Radio(input: RadioProps) {
  const { props, tokens: t, spring, checked, select } = useRadio(input);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const disabled = !!props.isDisabled;
  const colors = controlColors(t, {
    on: checked,
    disabled,
    invalid: !!props.isInvalid,
    hovered,
    pressed,
  });
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
          type="radio"
          checked={checked}
          disabled={disabled}
          required={props.isRequired}
          aria-invalid={props.isInvalid || undefined}
          name={props.name}
          value={props.value}
          onChange={select}
          onFocus={(e) => setFocusVisible(e.currentTarget.matches?.(':focus-visible') ?? true)}
          onBlur={() => setFocusVisible(false)}
          style={visuallyHidden}
        />
        <motion.span
          aria-hidden
          data-part="circle"
          initial={false}
          animate={{
            backgroundColor: colors.fill,
            borderColor: colors.border,
            scale: pressed && spring ? t.pressedScale : 1,
          }}
          transition={{ backgroundColor: color, borderColor: color, scale: pop }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            data-part="dot"
            initial={false}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={pop}
            style={{
              flexShrink: 0,
              width: t.dotSize,
              height: t.dotSize,
              borderRadius: t.dotSize / 2,
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

export function RadioGroup(input: RadioGroupProps) {
  const { props, value, select } = useRadioGroup(input);
  const fallbackName = useId();
  const name = props.name ?? fallbackName;
  return (
    <div
      role="radiogroup"
      aria-label={props.label}
      aria-required={props.isRequired || undefined}
      aria-invalid={props.isInvalid || undefined}
      data-testid={props.testID}
      style={{
        display: 'flex',
        flexDirection: props.direction === 'horizontal' ? 'row' : 'column',
        flexWrap: props.direction === 'horizontal' ? 'wrap' : undefined,
        columnGap: 16,
      }}
    >
      {props.options.map((o) => (
        <Radio
          key={o.value}
          label={o.label}
          value={o.value}
          name={name}
          isChecked={value === o.value}
          isDisabled={props.isDisabled || o.isDisabled}
          isInvalid={props.isInvalid}
          tokens={props.tokens}
          motion={props.motion}
          onChange={select}
          testID={props.testID && `${props.testID}-${o.value}`}
        />
      ))}
    </div>
  );
}
