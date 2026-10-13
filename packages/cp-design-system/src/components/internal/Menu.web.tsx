import { Fragment, useEffect, useId, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion, useTheme } from '../../theme/context';
import { Icon } from '../Icon/Icon.web';
import {
  firstEnabled,
  getMenuTokens,
  groupHeaderAt,
  nextEnabled,
  type MenuOption,
  type MenuTokens,
} from './menuTokens';
import type { Placement } from './placement';
import { systemFontStack } from './portalFont';
import { useAnchorPosition } from './useAnchorPosition.web';

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
  placement?: Placement;
  /** Keep the menu open after choosing an item (checkbox items). */
  keepOpenOnSelect?: boolean;
  tokens?: Partial<MenuTokens>;
  testID?: string;
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
  const [active, setActive] = useState(-1);
  const baseId = useId();
  const typed = useRef({ text: '', at: 0 });
  const { isOpen, onClose, anchorRef, options } = props;
  const placement = props.placement ?? (props.alignEnd ? 'bottom-end' : 'bottom-start');
  const pos = useAnchorPosition(isOpen, anchorRef, listRef, placement, t.offset);

  const close = (refocus = true) => {
    onClose();
    if (!refocus) return;
    const el = (props.returnFocusRef ?? anchorRef).current;
    const target = el?.matches('button, a, input, [tabindex]') ? el : el?.querySelector('button');
    (target as HTMLElement | null | undefined)?.focus();
  };

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
    // Checkbox items stay open so several can be toggled.
    if (!props.keepOpenOnSelect && option.isChecked === undefined) close();
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
  const above = pos?.side === 'top';

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
          initial={{ opacity: 0, y: above ? 4 : -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, transition: reduceMotion ? { duration: 0 } : { duration: 0.1 } }}
          transition={transition}
          style={{
            position: 'fixed',
            zIndex: 700,
            top: pos?.top ?? -9999,
            left: pos?.left ?? -9999,
            minWidth: pos?.anchorWidth,
            maxWidth: 'calc(100vw - 16px)',
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
            transformOrigin: above ? 'bottom' : 'top',
          }}
        >
          {options.map((o, i) => {
            const selected = listbox && o.value === props.selectedValue;
            const isActive = i === active;
            const checkable = o.isChecked !== undefined;
            const header = groupHeaderAt(options, i);
            return (
              <Fragment key={o.value}>
                {header && (
                  <div
                    role="presentation"
                    style={{
                      padding: `${i === 0 ? 4 : 12}px ${t.itemPaddingX}px 4px`,
                      borderTop: i === 0 ? 'none' : `1px solid ${t.divider}`,
                      marginTop: i === 0 ? 0 : 4,
                      color: t.groupTitle,
                      fontSize: 11,
                      lineHeight: '16px',
                      fontWeight: 653,
                      textTransform: 'uppercase',
                    }}
                  >
                    {header}
                  </div>
                )}
                <div
                  id={`${baseId}-${i}`}
                  role={listbox ? 'option' : checkable ? 'menuitemcheckbox' : 'menuitem'}
                  aria-selected={listbox ? selected : undefined}
                  aria-checked={checkable ? !!o.isChecked : undefined}
                  aria-disabled={o.isDisabled || undefined}
                  data-active={isActive || undefined}
                  onPointerMove={() => !o.isDisabled && setActive(i)}
                  onClick={() => choose(i)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: `${t.itemPaddingY}px ${t.itemPaddingX}px`,
                    cursor: o.isDisabled ? 'not-allowed' : 'pointer',
                    color: o.isDisabled ? t.textDisabled : selected ? t.textSelected : t.text,
                    background: selected
                      ? t.itemSelected
                      : isActive
                        ? t.itemHovered
                        : 'transparent',
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
                  {checkable && (
                    <span style={{ display: 'flex', width: 16, flexShrink: 0 }}>
                      {o.isChecked && <Icon glyph="check" size="medium" color={t.textSelected} />}
                    </span>
                  )}
                  {o.icon && (
                    <Icon
                      glyph={o.icon}
                      size="medium"
                      color={o.isDisabled ? t.textDisabled : t.icon}
                    />
                  )}
                  <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap' }}>
                    {o.label}
                    {o.description && (
                      <span
                        style={{
                          display: 'block',
                          color: o.isDisabled ? t.textDisabled : t.description,
                          fontSize: 12,
                          lineHeight: '16px',
                        }}
                      >
                        {o.description}
                      </span>
                    )}
                  </span>
                  {listbox && selected && (
                    <Icon glyph="check" size="small" color={t.textSelected} />
                  )}
                </div>
              </Fragment>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
