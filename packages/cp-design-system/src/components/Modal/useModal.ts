import { useCallback, useRef, useState } from 'react';
import { resolveSpring, resolveTokens, withoutUndefined } from '../../theme/component';
import { useReducedMotion, useTheme } from '../../theme/context';
import { getModalTokens, modalIconColor, modalWidths } from './Modal.tokens';
import type { ModalProps } from './Modal.types';

/**
 * Platform-independent Modal behaviour. `mounted` stays true while the exit animation runs;
 * renderers call `finishClose()` when it ends (at once when not animated).
 */
export function useModal(input: ModalProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const config = theme.components.Modal;
  const props = { ...config?.defaultProps, ...withoutUndefined(input) } as ModalProps;
  const tokens = resolveTokens(getModalTokens(theme), theme, config?.tokens, props.tokens);
  // Modal uses Atlassian's timed curves; a motion override only decides whether it animates.
  const animated = !!resolveSpring(theme, reduceMotion, 'gentle', props.motion, config?.motion);
  const width =
    typeof props.width === 'number' ? props.width : modalWidths[props.width ?? 'medium'];

  const [mounted, setMounted] = useState(props.isOpen);
  if (props.isOpen && !mounted) setMounted(true);
  const mountedRef = useRef(mounted);
  mountedRef.current = mounted || props.isOpen;

  const latest = useRef(props);
  latest.current = props;
  /** Unmounts after the exit animation. Ignored if the modal was reopened meanwhile. */
  const finishClose = useCallback(() => {
    if (latest.current.isOpen) return;
    if (!mountedRef.current) return;
    mountedRef.current = false;
    setMounted(false);
    latest.current.onCloseComplete?.();
  }, []);

  return {
    props,
    tokens,
    animated,
    width,
    mounted,
    finishClose,
    icon: modalIconColor(tokens, props.appearance),
    enter: theme.motion.interactions['modal.enter'],
    exit: theme.motion.interactions['modal.exit'],
  };
}
