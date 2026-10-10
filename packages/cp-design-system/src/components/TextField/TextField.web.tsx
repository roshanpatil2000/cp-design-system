import { useEffect, useId, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useAnimate } from 'motion/react';
import { useMediaQuery } from '../../theme/useMediaQuery.web';
import type { MessageKind } from './useTextField';
import type { TextFieldProps, TextFieldType } from './TextField.types';
import { useTextField } from './useTextField';

const inputTypes: Record<TextFieldType, string> = {
  text: 'text',
  email: 'email',
  password: 'password',
  number: 'number',
  tel: 'tel',
  url: 'url',
  search: 'search',
};

const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
};

/** 12px status icon drawn with plain shapes so it matches the native version exactly. */
function MessageIcon({ kind, color, glyph }: { kind: MessageKind; color: string; glyph: string }) {
  if (kind === 'helper') return null;
  return (
    <span
      aria-hidden
      style={{
        position: 'relative',
        flexShrink: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        background: color,
      }}
    >
      {kind === 'error' ? (
        <>
          <span
            style={{
              position: 'absolute',
              left: 5,
              top: 2.5,
              width: 2,
              height: 4.5,
              borderRadius: 1,
              background: glyph,
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: 5,
              top: 8,
              width: 2,
              height: 2,
              borderRadius: 1,
              background: glyph,
            }}
          />
        </>
      ) : (
        <span
          style={{
            position: 'absolute',
            left: 4,
            top: 2,
            width: 3.5,
            height: 6,
            borderStyle: 'solid',
            borderColor: glyph,
            borderWidth: '0 1.75px 1.75px 0',
            transform: 'rotate(45deg)',
            boxSizing: 'border-box',
          }}
        />
      )}
    </span>
  );
}

/** Announces text to screen readers once typing settles (Atlassian debounces its counter too). */
function useDebounced(value: string | undefined, ms: number) {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return settled;
}

export function TextField(input: TextFieldProps) {
  const touch = useMediaQuery('(pointer: coarse) and (max-width: 30rem)');
  const f = useTextField(input, touch);
  const { props, tokens: t, theme, reduceMotion } = f;
  const id = useId();
  const cls = `cpds-tf-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const messageId = f.message ? `${id}-message` : undefined;
  const counterId = f.counter ? `${id}-counter` : undefined;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [scope, animateShake] = useAnimate<HTMLDivElement>();
  const announced = useDebounced(f.counter?.text, 500);

  useEffect(() => {
    if (!f.shakeKey || !f.animate || !scope.current) return;
    const d = t.shakeDistance;
    animateShake(
      scope.current,
      { x: [0, -d, d, -d * 0.6, d * 0.6, -d * 0.25, 0] },
      { duration: 0.36 },
    );
  }, [f.shakeKey, f.animate, t.shakeDistance, animateShake, scope]);

  const disabled = !!props.isDisabled;
  const background = disabled
    ? t.backgroundDisabled
    : focused
      ? t.backgroundFocused
      : hovered
        ? t.backgroundHovered
        : t.background;
  const borderColor = disabled
    ? t.borderDisabled
    : f.isInvalid
      ? t.borderInvalid
      : focused
        ? t.borderFocused
        : hovered
          ? t.borderHovered
          : t.border;
  // A 1px inset ring on top of the 1px border gives Atlassian's 2px focus/invalid edge with no layout shift.
  const ring = disabled ? null : f.isInvalid ? t.borderInvalid : focused ? t.borderFocused : null;
  const ease = theme.motion.easings['out.practical'].join(', ');
  const transition = reduceMotion
    ? 'none'
    : `background-color 150ms cubic-bezier(${ease}), border-color 150ms cubic-bezier(${ease}), box-shadow 150ms cubic-bezier(${ease})`;
  const textColor = disabled ? t.textDisabled : t.text;
  const fontFamily = props.isMonospaced
    ? (t.monoFontFamily ?? 'monospace')
    : (t.fontFamily ?? 'inherit');
  const messageColor = (kind: MessageKind) =>
    kind === 'error' ? t.errorColor : kind === 'valid' ? t.validColor : t.helperColor;
  const enter = reduceMotion
    ? { duration: 0 }
    : {
        duration: 0.15,
        ease: [...theme.motion.easings['out.practical']] as [number, number, number, number],
      };
  const exit = reduceMotion
    ? { duration: 0 }
    : {
        duration: 0.1,
        ease: [...theme.motion.easings['in.practical']] as [number, number, number, number],
      };
  const messageStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.space['075'],
    marginTop: theme.space['050'],
    fontSize: t.messageFontSize,
    lineHeight: `${t.messageLineHeight}px`,
    fontFamily: t.fontFamily ?? 'inherit',
  };

  return (
    <div
      data-testid={props.testID}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: f.width ?? '100%',
      }}
    >
      <style>{`.${cls}::placeholder{color:${disabled ? t.placeholderDisabled : t.placeholder};opacity:1}`}</style>
      {props.label && (
        <label
          htmlFor={id}
          style={{
            alignSelf: 'flex-start',
            marginBottom: theme.space['050'],
            color: t.labelColor,
            fontSize: t.labelFontSize,
            lineHeight: `${t.labelLineHeight}px`,
            fontWeight: t.labelFontWeight,
            fontFamily: t.fontFamily ?? 'inherit',
          }}
        >
          {props.label}
          {props.isRequired && (
            <span aria-hidden style={{ color: t.requiredColor, paddingLeft: theme.space['025'] }}>
              *
            </span>
          )}
        </label>
      )}
      <div
        ref={scope}
        data-part="field"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          width: '100%',
          padding: `${t.borderWidth}px 0`,
          border: `${t.borderWidth}px ${props.appearance === 'none' ? 'none' : 'solid'} ${borderColor}`,
          borderRadius: t.radius,
          background,
          boxShadow: ring ? `inset 0 0 0 ${t.borderWidth}px ${ring}` : 'none',
          transition,
          color: textColor,
          cursor: disabled ? 'not-allowed' : 'text',
          overflow: 'hidden',
        }}
      >
        {props.elemBeforeInput && (
          <span
            data-part="before"
            style={{ display: 'flex', flexShrink: 0, paddingLeft: t.paddingX }}
          >
            {props.elemBeforeInput}
          </span>
        )}
        <input
          id={id}
          className={cls}
          name={props.name}
          type={inputTypes[props.type ?? 'text']}
          value={f.value}
          onChange={(e) => f.setValue(e.target.value)}
          onFocus={() => {
            setFocused(true);
            props.onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            f.markTouched();
            props.onBlur?.();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) props.onSubmit?.();
          }}
          placeholder={props.placeholder}
          disabled={disabled}
          readOnly={props.isReadOnly}
          required={props.isRequired}
          autoComplete={props.autoComplete}
          autoFocus={props.autoFocus}
          aria-label={props.label ? undefined : props.accessibilityLabel}
          aria-invalid={f.isInvalid || undefined}
          aria-describedby={[messageId, counterId].filter(Boolean).join(' ') || undefined}
          style={{
            flex: 1,
            minWidth: 0,
            width: '100%',
            boxSizing: 'border-box',
            margin: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: `${f.paddingY}px ${t.paddingX}px`,
            color: textColor,
            fontFamily,
            fontSize: t.fontSize,
            lineHeight: `${t.lineHeight}px`,
            cursor: disabled ? 'not-allowed' : 'text',
            textOverflow: 'ellipsis',
          }}
        />
        {props.elemAfterInput && (
          <span
            data-part="after"
            style={{ display: 'flex', flexShrink: 0, paddingRight: t.paddingX }}
          >
            {props.elemAfterInput}
          </span>
        )}
      </div>
      <AnimatePresence initial={false}>
        {f.message && (
          <motion.div
            key={`${f.message.kind}:${f.message.text}`}
            id={messageId}
            data-part={`message-${f.message.kind}`}
            initial={{ opacity: 0, y: 2, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', transition: enter }}
            exit={{ opacity: 0, y: 2, height: 0, transition: exit }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ ...messageStyle, color: messageColor(f.message.kind) }}>
              <MessageIcon
                kind={f.message.kind}
                color={messageColor(f.message.kind)}
                glyph={theme.color['color.icon.inverse']}
              />
              <span>{f.message.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {f.counter && (
        <div
          id={counterId}
          data-part="counter"
          aria-hidden
          style={{ ...messageStyle, color: f.counter.isError ? t.errorColor : t.helperColor }}
        >
          {f.counter.isError && (
            <MessageIcon
              kind="error"
              color={t.errorColor}
              glyph={theme.color['color.icon.inverse']}
            />
          )}
          <span>{f.counter.text}</span>
        </div>
      )}
      {f.counter && (
        <span aria-live="polite" style={visuallyHidden}>
          {announced}
        </span>
      )}
    </div>
  );
}
