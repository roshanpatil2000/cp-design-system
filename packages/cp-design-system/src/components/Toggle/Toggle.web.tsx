import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { mixHex } from '../../theme/color';
import { thumbGeometry, toggleIconLayout } from './Toggle.geometry';
import { thumbTravel } from './Toggle.tokens';
import type { ToggleProps } from './Toggle.types';
import { useToggle } from './useToggle';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Pointer movement (px) before a press becomes a drag. */
const DRAG_THRESHOLD = 3;

export function Toggle(input: ToggleProps) {
  const {
    props,
    tokens: t,
    spring,
    checked,
    interactive,
    commit,
    toggle,
    settleKey,
  } = useToggle(input);
  const travel = thumbTravel(t);
  const icons = toggleIconLayout(t);
  const squish = !!spring && t.thumbStretch > 0;

  // 0 = off, 1 = on. Follows the finger while dragging, springs otherwise.
  const progress = useMotionValue(checked ? 1 : 0);
  const press = useMotionValue(0);
  const hover = useMotionValue(0);
  const drag = useRef<{ startX: number; start: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [focusVisible, setFocusVisible] = useState(false);

  useEffect(() => {
    if (drag.current?.moved) return;
    const target = checked ? 1 : 0;
    if (!spring) {
      progress.set(target);
      return;
    }
    const controls = animate(progress, target, { type: 'spring', ...spring });
    return () => controls.stop();
  }, [checked, settleKey, spring, progress]);

  const setPress = (value: number) => {
    if (squish) animate(press, value, { type: 'spring', ...spring });
  };

  const trackColor = useTransform(() => {
    if (props.isDisabled) return t.trackDisabled;
    const h = hover.get();
    return mixHex(
      mixHex(t.trackOff, t.trackOffHovered, h),
      mixHex(t.trackOn, t.trackOnHovered, h),
      progress.get(),
    );
  });
  const thumbX = useTransform(() => thumbGeometry(t, progress.get(), press.get()).x);
  const thumbWidth = useTransform(() => thumbGeometry(t, progress.get(), press.get()).width);
  const checkOpacity = progress;
  const checkScale = useTransform(() => 0.5 + 0.5 * progress.get());
  const crossOpacity = useTransform(() => 1 - progress.get());
  const crossScale = useTransform(() => 1 - 0.5 * progress.get());

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (!interactive || e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { startX: e.clientX, start: progress.get(), moved: false };
    setPress(1);
  };
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) < DRAG_THRESHOLD) return;
    d.moved = true;
    progress.stop();
    progress.set(clamp01(d.start + dx / travel));
  };
  const endPointer = (cancelled: boolean) => {
    const d = drag.current;
    drag.current = null;
    setPress(0);
    if (!d?.moved) return;
    suppressClick.current = true;
    commit(cancelled ? checked : progress.get() > 0.5);
  };

  const iconColor = (on: boolean) =>
    props.isDisabled ? t.iconDisabled : on ? t.iconOn : t.iconOff;

  return (
    <>
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={props.label}
        aria-busy={props.isLoading || undefined}
        disabled={props.isDisabled}
        data-testid={props.testID}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          toggle();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => endPointer(false)}
        onPointerCancel={() => endPointer(true)}
        onPointerEnter={() => interactive && animate(hover, 1, { duration: 0.15 })}
        onPointerLeave={() => animate(hover, 0, { duration: 0.15 })}
        onFocus={(e) => setFocusVisible(e.currentTarget.matches?.(':focus-visible') ?? true)}
        onBlur={() => setFocusVisible(false)}
        style={{
          position: 'relative',
          flexShrink: 0,
          boxSizing: 'border-box',
          width: t.width,
          height: t.height,
          padding: 0,
          margin: 0,
          border: 'none',
          borderRadius: 9999,
          backgroundColor: trackColor,
          cursor: props.isDisabled ? 'not-allowed' : props.isLoading ? 'progress' : 'pointer',
          outline: focusVisible ? `${t.focusRingWidth}px solid ${t.focusRing}` : 'none',
          outlineOffset: t.focusRingGap,
          touchAction: 'pan-y',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <motion.span
          aria-hidden
          data-part="check"
          style={{
            position: 'absolute',
            ...icons.check,
            boxSizing: 'border-box',
            borderStyle: 'solid',
            borderColor: iconColor(true),
            borderWidth: `0 ${icons.stroke}px ${icons.stroke}px 0`,
            rotate: 45,
            opacity: checkOpacity,
            scale: checkScale,
          }}
        />
        {[45, -45].map((angle) => (
          <motion.span
            key={angle}
            aria-hidden
            data-part="cross"
            style={{
              position: 'absolute',
              ...icons.cross,
              borderRadius: icons.stroke,
              background: iconColor(false),
              rotate: angle,
              opacity: crossOpacity,
              scale: crossScale,
            }}
          />
        ))}
        <motion.span
          aria-hidden
          data-part="thumb"
          animate={props.isLoading && spring ? { scale: [1, 0.72, 1] } : { scale: 1 }}
          transition={
            props.isLoading && spring
              ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.15 }
          }
          style={{
            position: 'absolute',
            top: (t.height - t.thumbSize) / 2,
            left: 0,
            x: thumbX,
            width: thumbWidth,
            height: t.thumbSize,
            borderRadius: 9999,
            background: t.thumb,
            boxShadow: props.isDisabled ? 'none' : '0 1px 2px rgba(9, 30, 66, 0.25)',
          }}
        />
      </motion.button>
      {props.name && checked && (
        <input type="hidden" name={props.name} value={props.value ?? 'on'} />
      )}
    </>
  );
}
