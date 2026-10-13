import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import { Heading } from '../Heading/Heading.web';
import { IconButton } from '../IconButton/IconButton.web';
import { focusInto, trapTab } from '../internal/focusables.web';
import { systemFontStack } from '../internal/portalFont';
import { drawerWidths, getDrawerTokens, type DrawerProps } from './Drawer.types';

/**
 * A panel that slides in from the side over a blanket. Traps focus, closes on Escape or a
 * blanket click, locks page scrolling, and returns focus where it was.
 */
export function Drawer(input: DrawerProps) {
  const { props, tokens: t, spring } = useComponent('Drawer', input, getDrawerTokens, 'gentle');
  const [mounted, setMounted] = useState(props.isOpen);
  if (props.isOpen && !mounted) setMounted(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(props.onClose);
  onCloseRef.current = props.onClose;
  const placement = props.placement ?? 'left';
  const width =
    typeof props.width === 'number' ? props.width : drawerWidths[props.width ?? 'narrow'];
  const off = placement === 'left' ? '-100%' : '100%';
  const slide = spring ? { type: 'spring' as const, ...spring } : { duration: 0 };

  useEffect(() => {
    if (!props.isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => focusInto(panelRef.current));
    // Escape works even before focus has moved into the drawer.
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [props.isOpen]);

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        setMounted(false);
        props.onCloseComplete?.();
      }}
    >
      {props.isOpen && (
        <div
          key="drawer"
          onKeyDown={(e) => trapTab(e, panelRef.current)}
          style={{ position: 'fixed', inset: 0, zIndex: 520 }}
        >
          <motion.div
            data-part="blanket"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: spring ? 0.2 : 0 }}
            onClick={props.onClose}
            style={{ position: 'absolute', inset: 0, background: t.blanket }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={props.title ?? props.label}
            tabIndex={-1}
            data-testid={props.testID}
            initial={{ x: off }}
            animate={{ x: 0 }}
            exit={{
              x: off,
              transition: spring ? { duration: 0.2, ease: [0.6, 0, 0.8, 0.6] } : { duration: 0 },
            }}
            transition={slide}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              [placement]: 0,
              width,
              maxWidth: '100vw',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              background: t.background,
              boxShadow: t.shadow,
              fontFamily: systemFontStack,
              outline: 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                padding: `${t.padding - 8}px ${t.padding - 8}px 0 ${t.padding}px`,
              }}
            >
              {props.title ? (
                <Heading size="medium" as="h2">
                  {props.title}
                </Heading>
              ) : (
                <span />
              )}
              <IconButton icon="cross" label="Close" appearance="subtle" onPress={props.onClose} />
            </div>
            <div data-part="body" style={{ flex: 1, overflowY: 'auto', padding: t.padding }}>
              {props.children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
