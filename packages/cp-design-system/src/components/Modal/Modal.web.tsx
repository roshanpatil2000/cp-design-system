import { useEffect, useId, useRef, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useMediaQuery } from '../../theme/useMediaQuery.web';
import { systemFontStack } from '../internal/portalFont';
import { StatusIcon } from '../internal/StatusIcon.web';
import type { ModalProps } from './Modal.types';
import { useModal } from './useModal';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/**
 * Atlassian's modal dialog: a blanket, a centered dialog with header, scrolling body and footer.
 * Traps focus while open, closes on Escape, and returns focus to where it was.
 */
export function Modal(input: ModalProps) {
  const m = useModal(input);
  if (!m.mounted || typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence onExitComplete={m.finishClose}>
      {m.props.isOpen && <Dialog key="modal" m={m} />}
    </AnimatePresence>,
    document.body,
  );
}

function Dialog({ m }: { m: ReturnType<typeof useModal> }) {
  const { props, tokens: t, animated, width, icon } = m;
  const fullScreen = useMediaQuery('(max-width: 30rem)');
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeOnBlanket = props.shouldCloseOnBlanketClick ?? true;
  const closeOnEscape = props.shouldCloseOnEscapePress ?? true;

  // Focus the first control (or the dialog), lock page scroll, and restore both on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const first = dialog?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialog)?.focus({ preventScroll: true });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && closeOnEscape) {
      e.stopPropagation();
      props.onClose();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) {
      e.preventDefault();
      return;
    }
    const first = items[0]!;
    const last = items[items.length - 1]!;
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === dialogRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const enter = animated
    ? { duration: m.enter.duration / 1000, ease: m.enter.easing }
    : { duration: 0 };
  const exit = animated
    ? { duration: m.exit.duration / 1000, ease: m.exit.easing }
    : { duration: 0 };

  return (
    <div
      onKeyDown={onKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 510,
        display: 'flex',
        alignItems: fullScreen ? 'stretch' : 'flex-start',
        justifyContent: 'center',
      }}
    >
      <motion.div
        data-part="blanket"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: enter }}
        exit={{ opacity: 0, transition: exit }}
        onClick={() => closeOnBlanket && props.onClose()}
        style={{ position: 'absolute', inset: 0, background: t.blanket }}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-testid={props.testID}
        initial={{ opacity: 0, y: t.slide }}
        animate={{ opacity: 1, y: 0, transition: enter }}
        exit={{ opacity: 0, y: t.slide, transition: exit }}
        style={{
          position: 'relative',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          width: fullScreen ? '100%' : width,
          maxWidth: fullScreen ? undefined : 'calc(100vw - 120px)',
          maxHeight: fullScreen ? undefined : `calc(100vh - ${t.offsetTop * 2 - 1}px)`,
          marginTop: fullScreen ? 0 : t.offsetTop,
          borderRadius: fullScreen ? 0 : t.radius,
          background: t.background,
          boxShadow: t.shadow,
          color: t.body,
          fontFamily: t.fontFamily ?? systemFontStack,
          fontSize: t.fontSize,
          lineHeight: `${t.lineHeight}px`,
          outline: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: `${t.headerPaddingTop}px ${t.paddingX}px ${t.headerPaddingBottom}px`,
          }}
        >
          {icon && props.appearance && (
            <StatusIcon
              kind={props.appearance === 'danger' ? 'error' : 'warning'}
              size={20}
              color={icon}
              glyph={t.iconGlyph}
            />
          )}
          <h1
            id={titleId}
            style={{
              margin: 0,
              color: t.title,
              fontFamily: t.headingFontFamily ?? t.fontFamily,
              fontSize: t.titleFontSize,
              lineHeight: `${t.titleLineHeight}px`,
              fontWeight: t.titleFontWeight,
            }}
          >
            {props.title}
          </h1>
        </div>
        <div
          data-part="body"
          style={{ flex: '1 1 auto', overflowY: 'auto', padding: `2px ${t.paddingX}px` }}
        >
          {props.children}
        </div>
        {props.footer ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: t.footerGap,
              padding: `${t.footerPaddingTop}px ${t.paddingX}px ${t.footerPaddingBottom}px`,
            }}
          >
            {props.footer}
          </div>
        ) : (
          <div style={{ height: t.footerPaddingBottom }} />
        )}
      </motion.div>
    </div>
  );
}
