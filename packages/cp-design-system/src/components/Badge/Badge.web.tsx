import { useEffect, useRef } from 'react';
import { animate, motion, useMotionValue } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import { badgeText, getBadgeTokens, type BadgeProps } from './Badge.types';

/** A count, e.g. unread notifications. It pops when the value changes. */
export function Badge(input: BadgeProps) {
  const { props, tokens: t, spring } = useComponent('Badge', input, getBadgeTokens, 'bouncy');
  const text = badgeText(props.children, props.max, props.appearance === 'added');
  const scale = useMotionValue(1);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!spring || t.popScale === 1) return;
    scale.set(t.popScale);
    const c = animate(scale, 1, { type: 'spring', ...spring });
    return () => c.stop();
  }, [text, spring, t.popScale, scale]);
  return (
    <motion.span
      data-testid={props.testID}
      style={{
        display: 'inline-block',
        boxSizing: 'border-box',
        minWidth: t.minWidth,
        padding: `0 ${t.paddingX}px`,
        borderRadius: t.radius,
        background: t.background,
        color: t.text,
        fontFamily: t.fontFamily ?? 'inherit',
        fontSize: t.fontSize,
        lineHeight: `${t.lineHeight}px`,
        fontWeight: t.fontWeight,
        textAlign: 'center',
        fontVariantNumeric: 'tabular-nums',
        scale,
      }}
    >
      {text}
    </motion.span>
  );
}
