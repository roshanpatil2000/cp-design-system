import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { motion } from 'motion/react';
import type { RangeProps } from './Range.types';
import { useRange } from './useRange';

/** A slider for picking a number in a range: drag, click the track, or use the keyboard. */
export function Range(input: RangeProps) {
  const r = useRange(input);
  const { props, tokens: t, spring } = r;
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const fromPointer = (e: PointerEvent) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    r.setFraction((e.clientX - rect.left) / rect.width);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const big = Math.max(r.step, (r.max - r.min) / 10);
    const moves: Record<string, number> = {
      ArrowRight: r.value + r.step,
      ArrowUp: r.value + r.step,
      ArrowLeft: r.value - r.step,
      ArrowDown: r.value - r.step,
      PageUp: r.value + big,
      PageDown: r.value - big,
      Home: r.min,
      End: r.max,
    };
    if (e.key in moves) {
      e.preventDefault();
      r.set(moves[e.key]!);
    }
  };

  const follow = dragging || !spring ? { duration: 0 } : { type: 'spring' as const, ...spring };
  const pct = `${r.fraction * 100}%`;
  const fill = r.disabled ? t.disabledFill : t.fill;

  return (
    <div
      data-testid={props.testID}
      onPointerDown={(e) => {
        if (r.disabled || e.button !== 0) return;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        setDragging(true);
        fromPointer(e);
      }}
      onPointerMove={(e) => dragging && fromPointer(e)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: t.hitHeight,
        padding: `0 ${t.thumbSize / 2}px`,
        cursor: r.disabled ? 'not-allowed' : 'pointer',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          flex: 1,
          height: t.trackHeight,
          borderRadius: t.trackHeight,
          background: t.track,
        }}
      >
        <motion.div
          data-part="fill"
          initial={false}
          animate={{ width: pct }}
          transition={follow}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            borderRadius: t.trackHeight,
            background: fill,
          }}
        />
        <motion.div
          role="slider"
          tabIndex={r.disabled ? -1 : 0}
          aria-label={props.label}
          aria-valuemin={r.min}
          aria-valuemax={r.max}
          aria-valuenow={r.value}
          aria-valuetext={r.valueText}
          aria-disabled={r.disabled || undefined}
          data-part="thumb"
          onKeyDown={onKeyDown}
          onFocus={(e) => setFocusVisible(e.currentTarget.matches?.(':focus-visible') ?? true)}
          onBlur={() => setFocusVisible(false)}
          initial={false}
          animate={{ left: pct, scale: dragging && spring ? t.thumbPressedScale : 1 }}
          transition={{
            left: follow,
            scale: spring ? { type: 'spring', ...spring } : { duration: 0 },
          }}
          style={{
            position: 'absolute',
            top: '50%',
            width: t.thumbSize,
            height: t.thumbSize,
            marginLeft: -t.thumbSize / 2,
            marginTop: -t.thumbSize / 2,
            boxSizing: 'border-box',
            borderRadius: '50%',
            background: t.thumb,
            border: `1px solid ${t.thumbBorder}`,
            boxShadow: r.disabled ? 'none' : '0 1px 3px #1E1F2140',
            outline: focusVisible ? `2px solid ${t.focusRing}` : 'none',
            outlineOffset: 2,
          }}
        />
      </div>
    </div>
  );
}
