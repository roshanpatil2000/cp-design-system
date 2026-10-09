import { motion } from 'motion/react';

export interface SpinnerProps {
  size: number;
  color: string;
  testID?: string;
}

/**
 * A rotating three-quarter ring. Internal for now (used by Button); it becomes a public component
 * with its own tokens later. It keeps spinning with reduced motion because it conveys "busy".
 */
export function Spinner({ size, color, testID }: SpinnerProps) {
  const stroke = Math.max(1.5, size / 8);
  return (
    <motion.span
      aria-hidden
      data-testid={testID}
      data-part="spinner"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
      style={{
        display: 'inline-block',
        boxSizing: 'border-box',
        width: size,
        height: size,
        borderRadius: '50%',
        borderStyle: 'solid',
        borderWidth: stroke,
        borderColor: color,
        borderTopColor: 'transparent',
      }}
    />
  );
}
