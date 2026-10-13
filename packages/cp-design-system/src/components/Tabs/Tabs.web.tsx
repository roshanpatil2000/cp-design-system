import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { TabsProps } from './Tabs.types';
import { useTabs } from './useTabs';

/**
 * Atlassian tabs: a tab list with an underline that springs to the selected tab, and the
 * selected panel below. Arrow keys, Home and End move between tabs.
 */
export function Tabs(input: TabsProps) {
  const s = useTabs(input);
  const { props, tokens: t, spring } = s;
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  // `placed` stays false until the first measurement, so the underline appears in place on load
  // and only springs when the selection changes.
  const [indicator, setIndicator] = useState({ left: 0, width: 0, placed: false });
  const [hovered, setHovered] = useState<string | null>(null);
  const [focusVisible, setFocusVisible] = useState<string | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[s.selectedIndex];
      if (el)
        setIndicator((prev) => ({
          left: el.offsetLeft,
          width: el.offsetWidth,
          placed: prev.placed || prev.width > 0,
        }));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [s.selectedIndex, props.tabs, props.shouldFitContainer]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const target =
      e.key === 'ArrowRight'
        ? s.step(index, 1)
        : e.key === 'ArrowLeft'
          ? s.step(index, -1)
          : e.key === 'Home'
            ? s.step(-1, 1)
            : e.key === 'End'
              ? s.step(props.tabs.length, -1)
              : null;
    if (target === null) return;
    e.preventDefault();
    tabRefs.current[target]?.focus();
    s.select(props.tabs[target]!.id);
  };

  const panel = props.tabs[s.selectedIndex];
  const fade = spring ? { duration: 0.15 } : { duration: 0 };

  return (
    <div data-testid={props.testID}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={props.label}
        style={{ position: 'relative', display: 'flex', gap: t.gap }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: t.dividerHeight,
            background: t.divider,
            borderRadius: t.dividerHeight,
          }}
        />
        {props.tabs.map((tab, i) => {
          const selected = i === s.selectedIndex;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              aria-disabled={tab.isDisabled || undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => s.select(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              onPointerEnter={() => setHovered(tab.id)}
              onPointerLeave={() => setHovered(null)}
              onFocus={(e) =>
                setFocusVisible(
                  (e.currentTarget.matches?.(':focus-visible') ?? true) ? tab.id : null,
                )
              }
              onBlur={() => setFocusVisible(null)}
              style={{
                position: 'relative',
                flex: props.shouldFitContainer ? 1 : undefined,
                height: t.height,
                padding: `0 ${t.paddingX}px`,
                margin: 0,
                border: 'none',
                borderRadius: 3,
                background:
                  hovered === tab.id && !selected && !tab.isDisabled ? t.hoverBackground : 'none',
                color: tab.isDisabled
                  ? t.textDisabled
                  : selected
                    ? t.textSelected
                    : hovered === tab.id
                      ? t.textHovered
                      : t.text,
                fontFamily: t.fontFamily ?? 'inherit',
                fontSize: t.fontSize,
                lineHeight: `${t.lineHeight}px`,
                fontWeight: t.fontWeight,
                whiteSpace: 'nowrap',
                cursor: tab.isDisabled ? 'not-allowed' : 'pointer',
                outline: focusVisible === tab.id ? `2px solid ${t.focusRing}` : 'none',
                outlineOffset: -2,
                transition: spring ? 'color 150ms, background-color 150ms' : 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
        <motion.span
          aria-hidden
          data-part="indicator"
          initial={false}
          animate={{ x: indicator.left, width: indicator.width }}
          transition={spring && indicator.placed ? { type: 'spring', ...spring } : { duration: 0 }}
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: t.indicatorHeight,
            borderRadius: t.indicatorHeight,
            background: t.indicator,
          }}
        />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {panel && panel.content !== undefined && (
          <motion.div
            key={panel.id}
            role="tabpanel"
            id={`${baseId}-panel-${panel.id}`}
            aria-labelledby={`${baseId}-tab-${panel.id}`}
            tabIndex={0}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            style={{ paddingTop: 16, outline: 'none' }}
          >
            {panel.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
