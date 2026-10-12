import { motion } from 'motion/react';
import { useTheme } from '../../theme/context';
import { spinnerColor, spinnerPx, type SpinnerProps } from './Spinner.types';

/**
 * A rotating three-quarter ring that fades in. It keeps spinning with reduced motion because it
 * conveys "busy".
 */
export function Spinner(props: SpinnerProps) {
  const theme = useTheme();
  const size = spinnerPx(props.size);
  const color = spinnerColor(theme, props);
  const { testID } = props;
  const label = props.label === undefined ? 'Loading' : props.label;
  const stroke = Math.max(1.5, size / 8);
  return (
    <motion.span
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      data-testid={testID}
      data-part="spinner"
      initial={{ opacity: 0 }}
      animate={{ rotate: 360, opacity: 1 }}
      transition={{
        rotate: { duration: 0.8, ease: 'linear', repeat: Infinity },
        opacity: { duration: 0.2 },
      }}
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
