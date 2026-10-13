import { cloneElement, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import { systemFontStack } from '../internal/portalFont';
import { useAnchorPosition } from '../internal/useAnchorPosition.web';
import { getTooltipTokens, type TooltipProps } from './Tooltip.types';

/**
 * A short label that appears on hover or keyboard focus, and hides on Escape. The trigger gets
 * `aria-describedby`, so screen readers read the tooltip too.
 */
export function Tooltip(input: TooltipProps) {
  const { props, tokens: t, spring } = useComponent('Tooltip', input, getTooltipTokens);
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const pos = useAnchorPosition(open, anchorRef, tipRef, props.position ?? 'top', t.offset);

  const show = (delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const above = pos?.side === 'top';
  return (
    <>
      <span
        ref={anchorRef}
        data-testid={props.testID}
        onPointerEnter={() => show(props.delay ?? 300)}
        onPointerLeave={hide}
        onPointerDown={hide}
        onFocus={(e) => (e.target as HTMLElement).matches?.(':focus-visible') !== false && show(0)}
        onBlur={hide}
        style={{ display: 'inline-flex', verticalAlign: 'middle' }}
      >
        {cloneElement(props.children as React.ReactElement<Record<string, unknown>>, {
          'aria-describedby': open ? id : undefined,
        })}
      </span>
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={tipRef}
                id={id}
                role="tooltip"
                initial={spring ? { opacity: 0, y: above ? 4 : -4 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: spring ? 0.1 : 0 } }}
                transition={spring ? { duration: 0.15, ease: [0.4, 0, 0, 1] } : { duration: 0 }}
                style={{
                  position: 'fixed',
                  zIndex: 800,
                  top: pos?.top ?? -9999,
                  left: pos?.left ?? -9999,
                  maxWidth: t.maxWidth,
                  boxSizing: 'border-box',
                  padding: `${t.paddingY}px ${t.paddingX}px`,
                  borderRadius: t.radius,
                  background: t.background,
                  color: t.text,
                  fontFamily: t.fontFamily ?? systemFontStack,
                  fontSize: t.fontSize,
                  lineHeight: `${t.lineHeight}px`,
                  pointerEvents: 'none',
                  overflowWrap: 'break-word',
                }}
              >
                {props.content}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
