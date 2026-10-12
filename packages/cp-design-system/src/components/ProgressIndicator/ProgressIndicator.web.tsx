import { motion } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import {
  defaultStepLabel,
  getProgressIndicatorTokens,
  type ProgressIndicatorProps,
} from './ProgressIndicator.types';

/** Step dots, as in onboarding carousels. The current dot stretches into a pill with a spring. */
export function ProgressIndicator(input: ProgressIndicatorProps) {
  const {
    props,
    tokens: t,
    spring,
  } = useComponent('ProgressIndicator', input, getProgressIndicatorTokens);
  const label = props.stepLabel ?? defaultStepLabel;
  const interactive = !!props.onSelect;
  const transition = spring ? { type: 'spring' as const, ...spring } : { duration: 0 };
  return (
    <div
      role={interactive ? 'tablist' : 'img'}
      aria-label={interactive ? undefined : label(props.selectedIndex, props.count)}
      data-testid={props.testID}
      style={{ display: 'inline-flex', alignItems: 'center', gap: t.gap }}
    >
      {Array.from({ length: props.count }, (_, i) => {
        const selected = i === props.selectedIndex;
        const dot = (
          <motion.span
            data-part="dot"
            data-selected={selected || undefined}
            initial={false}
            animate={{
              width: selected ? t.dotSize * t.selectedStretch : t.dotSize,
              backgroundColor: selected ? t.selected : t.dot,
            }}
            transition={{ width: transition, backgroundColor: { duration: spring ? 0.2 : 0 } }}
            style={{ display: 'block', height: t.dotSize, borderRadius: t.dotSize / 2 }}
          />
        );
        return interactive ? (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={label(i, props.count)}
            onClick={() => props.onSelect?.(i)}
            style={{
              display: 'flex',
              padding: 4,
              margin: -4,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderRadius: t.dotSize,
            }}
          >
            {dot}
          </button>
        ) : (
          <span key={i} aria-hidden>
            {dot}
          </span>
        );
      })}
    </div>
  );
}
