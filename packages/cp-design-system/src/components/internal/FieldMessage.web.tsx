import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion, useTheme } from '../../theme/context';
import {
  messageIconKind,
  resolveFieldMessageStyle,
  type FieldMessageStyle,
  type FieldMessageValue,
} from './fieldMessageStyle';
import { StatusIcon } from './StatusIcon.web';

/**
 * Helper / error / valid message under a field. Messages slide 2px and fade in (150ms) and out
 * (100ms) while the space collapses, matching Atlassian's form message motion.
 */
export function FieldMessage({
  message,
  id,
  style,
}: {
  message: FieldMessageValue | null;
  id?: string;
  style?: FieldMessageStyle;
}) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const s = resolveFieldMessageStyle(theme, style);
  const color = (kind: FieldMessageValue['kind']) =>
    kind === 'error' ? s.errorColor : kind === 'valid' ? s.validColor : s.helperColor;
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

  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          key={`${message.kind}:${message.text}`}
          id={id}
          data-part={`message-${message.kind}`}
          initial={{ opacity: 0, y: 2, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto', transition: enter }}
          exit={{ opacity: 0, y: 2, height: 0, transition: exit }}
          style={{ overflow: 'hidden' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.space['075'],
              marginTop: theme.space['050'],
              fontSize: s.fontSize,
              lineHeight: `${s.lineHeight}px`,
              fontFamily: s.fontFamily ?? 'inherit',
              color: color(message.kind),
            }}
          >
            {messageIconKind[message.kind] && (
              <StatusIcon
                kind={messageIconKind[message.kind]!}
                size={12}
                color={color(message.kind)}
                glyph={s.glyph}
              />
            )}
            <span>{message.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
