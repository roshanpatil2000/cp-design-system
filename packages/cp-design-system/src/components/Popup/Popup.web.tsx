import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import { focusInto } from '../internal/focusables.web';
import { systemFontStack } from '../internal/portalFont';
import { useAnchorPosition } from '../internal/useAnchorPosition.web';
import { getPopupTokens, type PopupProps } from './Popup.types';

/**
 * A floating panel anchored to a trigger. Closes on Escape or a click outside, keeps itself on
 * screen, and returns focus to the trigger.
 */
export function Popup(input: PopupProps) {
  const { props, tokens: t, spring } = useComponent('Popup', input, getPopupTokens);
  return <PopupBase {...props} tokens={t} animated={!!spring} />;
}

/** Internal: Popup with resolved tokens, shared with InlineDialog. */
export function PopupBase(
  props: Omit<PopupProps, 'tokens'> & {
    tokens: ReturnType<typeof getPopupTokens>;
    animated: boolean;
  },
) {
  const t = props.tokens;
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const placement = props.placement ?? 'bottom-start';
  const pos = useAnchorPosition(props.isOpen, anchorRef, panelRef, placement, t.offset);
  const { isOpen, onClose } = props;
  const wasOpen = useRef(false);

  // Focus into the popup on open; give focus back to the trigger when it closes.
  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true;
      if (props.shouldFocusContent ?? true) {
        // Cancelled if the popup closes first, so focus isn't pulled into the exiting panel.
        const frame = requestAnimationFrame(() => focusInto(panelRef.current));
        return () => cancelAnimationFrame(frame);
      }
    } else if (wasOpen.current) {
      wasOpen.current = false;
      if (
        panelRef.current?.contains(document.activeElement) ||
        document.activeElement === document.body
      ) {
        focusInto(anchorRef.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        focusInto(anchorRef.current);
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  const above = pos?.side === 'top';
  const panel = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          role={props.role ?? 'dialog'}
          aria-label={props.label}
          tabIndex={-1}
          data-testid={props.testID}
          initial={props.animated ? { opacity: 0, y: above ? 4 : -4, scale: 0.98 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: props.animated ? 0.1 : 0 } }}
          transition={props.animated ? { duration: 0.15, ease: [0.4, 0, 0, 1] } : { duration: 0 }}
          style={{
            position: 'fixed',
            zIndex: 650,
            top: pos?.top ?? -9999,
            left: pos?.left ?? -9999,
            width: props.width,
            maxWidth: `min(${t.maxWidth}px, calc(100vw - 16px))`,
            boxSizing: 'border-box',
            padding: t.padding,
            borderRadius: t.radius,
            background: t.background,
            boxShadow: t.shadow,
            fontFamily: systemFontStack,
            outline: 'none',
            transformOrigin: above ? 'bottom' : 'top',
          }}
        >
          {props.content}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <span ref={anchorRef} style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
        {props.trigger}
      </span>
      {typeof document !== 'undefined' ? createPortal(panel, document.body) : null}
    </>
  );
}
