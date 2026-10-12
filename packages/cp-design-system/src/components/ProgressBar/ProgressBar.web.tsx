import { motion } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import { clampProgress, getProgressBarTokens, type ProgressBarProps } from './ProgressBar.types';

/** Atlassian's progress bar. The bar springs to new values; unknown progress shows a looping segment. */
export function ProgressBar(input: ProgressBarProps) {
  const {
    props,
    tokens: t,
    spring,
  } = useComponent('ProgressBar', input, getProgressBarTokens, 'gentle');
  const value = clampProgress(props.value);
  const indeterminate = !!props.isIndeterminate;
  return (
    <div
      role="progressbar"
      aria-label={props.label}
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={indeterminate ? undefined : value}
      data-testid={props.testID}
      style={{
        position: 'relative',
        width: '100%',
        height: t.height,
        borderRadius: t.radius,
        background: t.track,
        overflow: 'hidden',
      }}
    >
      {indeterminate ? (
        <motion.div
          data-part="bar"
          initial={{ left: `${-t.segment * 100}%` }}
          animate={spring ? { left: '100%' } : { left: `${50 - t.segment * 50}%` }}
          transition={
            spring
              ? { duration: t.loopDuration / 1000, ease: [0.4, 0, 0.2, 1], repeat: Infinity }
              : { duration: 0 }
          }
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: `${t.segment * 100}%`,
            borderRadius: t.radius,
            background: t.bar,
          }}
        />
      ) : (
        <motion.div
          data-part="bar"
          initial={false}
          animate={{ scaleX: value }}
          transition={spring ? { type: 'spring', ...spring } : { duration: 0 }}
          style={{
            height: '100%',
            borderRadius: t.radius,
            background: t.bar,
            originX: 0,
          }}
        />
      )}
    </div>
  );
}
