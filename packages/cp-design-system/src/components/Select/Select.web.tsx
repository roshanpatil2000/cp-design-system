import { useId, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useMediaQuery } from '../../theme/useMediaQuery.web';
import { Icon } from '../Icon/Icon.web';
import { FieldLabel } from '../internal/FieldLabel.web';
import { FieldMessage } from '../internal/FieldMessage.web';
import { Menu } from '../internal/Menu.web';
import { messageStyleOf } from '../internal/fieldLabelStyle';
import type { SelectProps } from './Select.types';
import { useSelect } from './useSelect';

/** Pick one option from a dropdown list, styled like a TextField. */
export function Select(input: SelectProps) {
  const touch = useMediaQuery('(pointer: coarse) and (max-width: 640px)');
  const s = useSelect(input, touch);
  const { props, tokens: t, spring } = s;
  const id = useId();
  const labelId = `${id}-label`;
  const messageId = `${id}-message`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const border = props.isInvalid
    ? t.borderInvalid
    : focused || s.open
      ? t.borderFocused
      : s.disabled
        ? t.borderDisabled
        : hovered
          ? t.borderHovered
          : t.border;
  // As in TextField: an inner ring when invalid (red) or focused (blue).
  const ring = s.disabled
    ? null
    : props.isInvalid
      ? t.borderInvalid
      : focused || s.open
        ? t.borderFocused
        : null;
  const background = s.disabled
    ? t.backgroundDisabled
    : focused || s.open
      ? t.backgroundFocused
      : hovered
        ? t.backgroundHovered
        : t.background;

  return (
    <div
      data-testid={props.testID}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: props.width ?? '100%',
      }}
    >
      {props.label && (
        <FieldLabel label={props.label} isRequired={props.isRequired} id={labelId} t={t} />
      )}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={s.disabled}
        aria-haspopup="listbox"
        aria-expanded={s.open}
        aria-labelledby={props.label ? `${labelId} ${id}` : undefined}
        aria-invalid={props.isInvalid || undefined}
        aria-required={props.isRequired || undefined}
        aria-describedby={s.message ? messageId : undefined}
        onClick={() => s.setOpen(!s.open)}
        onKeyDown={(e) => {
          if (!s.open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            s.setOpen(true);
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxSizing: 'border-box',
          width: '100%',
          height: t.height,
          margin: 0,
          padding: `0 ${t.paddingX}px 0 ${t.paddingX + 2}px`,
          border: `${t.borderWidth}px solid ${border}`,
          borderRadius: t.radius,
          boxShadow: ring ? `inset 0 0 0 1px ${ring}` : 'none',
          background,
          color: s.disabled ? t.textDisabled : s.selected ? t.text : t.placeholder,
          fontFamily: t.fontFamily ?? 'inherit',
          fontSize: t.fontSize,
          lineHeight: `${t.lineHeight}px`,
          textAlign: 'left',
          cursor: s.disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          transition: spring
            ? 'background-color 150ms, border-color 150ms, box-shadow 150ms'
            : 'none',
        }}
      >
        <span
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {s.selected?.label ?? s.placeholder}
        </span>
        <motion.span
          aria-hidden
          data-part="chevron"
          initial={false}
          animate={{ rotate: s.open ? 180 : 0 }}
          transition={spring ? { type: 'spring', ...spring } : { duration: 0 }}
          style={{ display: 'flex' }}
        >
          <Icon
            glyph="chevron-down"
            size="medium"
            color={s.disabled ? t.textDisabled : 'color.icon.subtle'}
          />
        </motion.span>
      </button>
      {props.name && <input type="hidden" name={props.name} value={s.value ?? ''} />}
      <FieldMessage message={s.message} id={messageId} style={messageStyleOf(t)} />
      <Menu
        role="listbox"
        isOpen={s.open}
        onClose={() => s.setOpen(false)}
        onSelect={s.select}
        options={props.options}
        selectedValue={s.value}
        anchorRef={triggerRef}
        label={props.label}
        testID={props.testID && `${props.testID}-options`}
      />
    </div>
  );
}
