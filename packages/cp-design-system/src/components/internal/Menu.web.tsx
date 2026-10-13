import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion, useTheme } from '../../theme/context';
import { Icon } from '../Icon/Icon.web';
import {
  firstEnabled,
  getMenuTokens,
  nextEnabled,
  type MenuOption,
  type MenuTokens,
} from './menuTokens';
import { systemFontStack } from './portalFont';

export interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: MenuOption[];
  anchorRef: RefObject<HTMLElement | null>;
  /** Where focus goes when the menu closes. Defaults to the anchor (or the first button in it). */
  returnFocusRef?: RefObject<HTMLElement | null>;
  /** `'listbox'` for Select (shows a check on the selected option), `'menu'` for actions. */
  role: 'listbox' | 'menu';
  selectedValue?: string | null;
  label?: string;
  /** Align the menu's right edge with the trigger instead of its left. */
  alignEnd?: boolean;
  tokens?: Partial<MenuTokens>;
  testID?: string;
}

interface Position {
  top: number;
  left: number;
  minWidth: number;
  above: boolean;
}

/**
 * A dropdown list anchored to a trigger: portaled, flips above when there's no room below, and
 * keyboard-driven (arrows, Home/End, Enter/Space, Escape, typeahead). Focus returns to the trigger.
 */
export function Menu(props: MenuProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const t = { ...getMenuTokens(theme), ...props.tokens };
  const listRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position | null>(null);
  const [active, setActive] = useState(-1);
  const baseId = useId();
  const typed = useRef({ text: '', at: 0 });
  const { isOpen, onClose, anchorRef, options } = props;

  const close = (refocus = true) => {
    onClose();
    if (!refocus) return;
    const el = (props.returnFocusRef ?? anchorRef).current;
    const target = el?.matches('button, a, input, [tabindex]') ? el : el?.querySelector('button');
    (target as HTMLElement | null | undefined)?.focus();
  };

  // Position below the trigger (or above when there's no room), and keep it there on scroll.
  useLayoutEffect(() => {
    if (!isOpen) return;
    const place = () => {
      const a = anchorRef.current?.getBoundingClientRect();
      if (!a) return;
      const h = listRef.current?.offsetHeight ?? 0;
      const above = a.bottom + t.offset + h > window.innerHeight && a.top - t.offset - h > 0;
      const width = Math.max(listRef.current?.offsetWidth ?? 0, a.width);
      const preferred = props.alignEnd ? a.right - width : a.left;
      // Keep the whole menu on screen, 8px from either edge.
      const left = Math.max(8, Math.min(preferred, window.innerWidth - width - 8));
      setPos({
        top: above ? a.top - t.offset - h : a.bottom + t.offset,
        left,
        minWidth: a.width,
        above,
      });
    };
    place();
    const raf = requestAnimationFrame(place);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [isOpen, anchorRef, t.offset, props.alignEnd]);

  // Start on the selected option (or the first enabled one) and take focus.
  useEffect(() => {
    if (!isOpen) return;
    const selected = options.findIndex((o) => o.value === props.selectedValue && !o.isDisabled);
    setActive(selected >= 0 ? selected : firstEnabled(options));
    listRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close on a pointer down outside the menu and its trigger.
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (listRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [isOpen, onClose, anchorRef]);

  useEffect(() => {
    if (active < 0) return;
    document.getElementById(`${baseId}-${active}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active, baseId]);

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.isDisabled) return;
    props.onSelect(option.value);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => nextEnabled(options, i, 1)),
      ArrowUp: () => setActive((i) => nextEnabled(options, i, -1)),
      Home: () => setActive(firstEnabled(options)),
      End: () => setActive(nextEnabled(options, 0, -1)),
      Enter: () => choose(active),
      ' ': () => choose(active),
      Escape: () => close(),
      Tab: () => close(false),
    };
    const action = keys[e.key];
    if (action) {
      if (e.key !== 'Tab') e.preventDefault();
      action();
      return;
    }
    if (e.key.length === 1 && /\S/.test(e.key)) {
      const now = Date.now();
      typed.current = {
        text: (now - typed.current.at < 600 ? typed.current.text : '') + e.key.toLowerCase(),
        at: now,
      };
      const match = options.findIndex(
        (o) => !o.isDisabled && o.label.toLowerCase().startsWith(typed.current.text),
      );
      if (match >= 0) setActive(match);
    }
  };

  if (typeof document === 'undefined') return null;
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.15, ease: [0.4, 0, 0, 1] as const };
  const listbox = props.role === 'listbox';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={listRef}
          role={props.role}
          aria-label={props.label}
          aria-activedescendant={active >= 0 ? `${baseId}-${active}` : undefined}
          tabIndex={-1}
          data-testid={props.testID}
          onKeyDown={onKeyDown}
          initial={{ opacity: 0, y: pos?.above ? 4 : -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, transition: reduceMotion ? { duration: 0 } : { duration: 0.1 } }}
          transition={transition}
          style={{
            position: 'fixed',
            zIndex: 700,
            top: pos?.top ?? -9999,
            left: pos?.left ?? -9999,
            minWidth: pos?.minWidth,
            maxHeight: t.maxHeight,
            overflowY: 'auto',
            boxSizing: 'border-box',
            padding: `${t.paddingY}px 0`,
            borderRadius: t.radius,
            background: t.background,
            boxShadow: t.shadow,
            fontFamily: t.fontFamily ?? systemFontStack,
            fontSize: t.fontSize,
            lineHeight: `${t.lineHeight}px`,
            outline: 'none',
            transformOrigin: pos?.above ? 'bottom' : 'top',
          }}
        >
          {options.map((o, i) => {
            const selected = o.value === props.selectedValue;
            const isActive = i === active;
            return (
              <div
                key={o.value}
                id={`${baseId}-${i}`}
                role={listbox ? 'option' : 'menuitem'}
                aria-selected={listbox ? selected : undefined}
                aria-disabled={o.isDisabled || undefined}
                data-active={isActive || undefined}
                onPointerMove={() => !o.isDisabled && setActive(i)}
                onClick={() => choose(i)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: `${t.itemPaddingY}px ${t.itemPaddingX}px`,
                  whiteSpace: 'nowrap',
                  cursor: o.isDisabled ? 'not-allowed' : 'pointer',
                  color: o.isDisabled ? t.textDisabled : selected ? t.textSelected : t.text,
                  background: selected ? t.itemSelected : isActive ? t.itemHovered : 'transparent',
                }}
              >
                {selected && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      background: t.selectedBar,
                    }}
                  />
                )}
                <span>{o.label}</span>
                {listbox && selected && <Icon glyph="check" size="small" color={t.textSelected} />}
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
