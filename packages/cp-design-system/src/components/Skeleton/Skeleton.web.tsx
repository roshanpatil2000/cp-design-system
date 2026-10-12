import { motion } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import { getSkeletonTokens, skeletonRadius, type SkeletonProps } from './Skeleton.types';

/** A placeholder shape that pulses while content loads. Hidden from assistive tech. */
export function Skeleton(input: SkeletonProps) {
  const {
    theme,
    props,
    tokens: t,
    reduceMotion,
  } = useComponent('Skeleton', input, getSkeletonTokens);
  const pulse = (props.isShimmering ?? true) && !reduceMotion;
  return (
    <motion.span
      aria-hidden
      data-testid={props.testID}
      data-shimmering={pulse || undefined}
      initial={false}
      animate={
        pulse
          ? { backgroundColor: [t.color, t.colorSubtle, t.color] }
          : { backgroundColor: t.color }
      }
      transition={
        pulse
          ? { duration: t.pulseDuration / 1000, ease: 'easeInOut', repeat: Infinity }
          : { duration: 0 }
      }
      style={{
        display: 'block',
        width: props.width ?? '100%',
        height: props.height ?? 16,
        borderRadius: skeletonRadius(theme, props.borderRadius),
      }}
    />
  );
}
