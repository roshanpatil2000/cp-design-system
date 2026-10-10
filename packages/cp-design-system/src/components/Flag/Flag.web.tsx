import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react';
import { useMediaQuery } from '../../theme/useMediaQuery.web';
import { systemFontStack } from '../internal/portalFont';
import { StatusIcon } from '../internal/StatusIcon.web';
import { FlagContext, useFlagStore, type FlagEntry } from './flagContext';
import type { FlagProviderProps } from './Flag.types';
import { useDismissTimer } from './useDismissTimer';
import { useFlag, useFlagProviderProps } from './useFlag';

/** Drag distance (px) or speed (px/s) that dismisses a flag. */
const SWIPE_DISTANCE = 100;
const SWIPE_VELOCITY = 500;

/**
 * Renders flags (Atlassian's toasts) in the bottom-left corner and gives descendants
 * `useFlags()` to show them. Put one near the root of your app.
 */
export function FlagProvider(input: FlagProviderProps) {
  const props = useFlagProviderProps(input);
  const { flags, api, dismissFlag } = useFlagStore(props, false);
  const narrow = useMediaQuery('(max-width: 560px)');
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const visible = flags.filter((f) => !f.leaving);

  const region = (
    <div
      role="region"
      aria-label={props.label ?? 'Notifications'}
      data-testid={props.testID ?? 'flag'}
      style={{
        position: 'fixed',
        zIndex: 600,
        bottom: narrow ? 16 : 48,
        left: narrow ? 16 : 80,
        right: narrow ? 16 : undefined,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence initial={false}>
        {visible.map((flag) => (
          <FlagItem
            key={flag.id}
            flag={flag}
            provider={props}
            narrow={narrow}
            onDismiss={() => dismissFlag(flag.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <FlagContext.Provider value={api}>
      {props.children}
      {mounted && typeof document !== 'undefined' ? createPortal(region, document.body) : null}
    </FlagContext.Provider>
  );
}

function FlagItem({
  flag,
  provider,
  narrow,
  onDismiss,
}: {
  flag: FlagEntry;
  provider: FlagProviderProps;
  narrow: boolean;
  onDismiss: () => void;
}) {
  const f = useFlag(flag, provider);
  const t = f.tokens;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const timer = useDismissTimer(f.duration, f.autoDismiss, hovered || focused, onDismiss);
  const progress = useMotionValue(1);
  const animated = !!f.spring;
  const testID = `${provider.testID ?? 'flag'}-${flag.id}`;

  // The countdown bar shrinks over the time left, and stops while the timer is paused.
  useEffect(() => {
    const left = timer.remaining.current / f.duration;
    progress.set(left);
    if (!timer.running || !animated) return;
    const controls = animate(progress, 0, {
      duration: timer.remaining.current / 1000,
      ease: 'linear',
    });
    return () => controls.stop();
  }, [timer.running, timer.remaining, f.duration, animated, progress]);

  const enter = { duration: f.enter.duration / 1000, ease: f.enter.easing };
  const exit = { duration: f.exit.duration / 1000, ease: f.exit.easing };
  const instant = { duration: 0 };

  return (
    <motion.div
      layout={animated ? 'position' : false}
      role={f.role}
      aria-labelledby={`${testID}-title`}
      data-testid={testID}
      data-appearance={f.appearance}
      initial={{ opacity: 0, x: -48 }}
      animate={{ opacity: 1, x: 0, transition: animated ? enter : instant }}
      exit={{ opacity: 0, x: -48, transition: animated ? exit : instant }}
      transition={{
        layout: { duration: f.reposition.duration / 1000, ease: f.reposition.easing },
      }}
      drag={animated ? 'x' : false}
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={(_e, info) => {
        if (Math.abs(info.offset.x) > SWIPE_DISTANCE || Math.abs(info.velocity.x) > SWIPE_VELOCITY)
          onDismiss();
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width: narrow ? '100%' : t.width,
        overflow: 'hidden',
        display: 'flex',
        gap: t.gap,
        padding: t.padding,
        borderRadius: t.radius,
        background: t.background,
        boxShadow: t.shadow,
        color: t.description,
        fontFamily: t.fontFamily ?? systemFontStack,
        fontSize: t.fontSize,
        lineHeight: `${t.lineHeight}px`,
        pointerEvents: 'auto',
        touchAction: 'pan-y',
        cursor: animated ? 'grab' : undefined,
      }}
    >
      {f.icon && (
        <span style={{ display: 'flex', height: t.titleLineHeight, alignItems: 'center' }}>
          <StatusIcon kind={f.icon} size={t.iconSize} color={t.icon} glyph={t.iconGlyph} />
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          id={`${testID}-title`}
          style={{
            color: t.title,
            fontSize: t.titleFontSize,
            lineHeight: `${t.titleLineHeight}px`,
            fontWeight: t.titleFontWeight,
            paddingInlineEnd: 24,
          }}
        >
          {flag.title}
        </div>
        {flag.description && <div style={{ marginTop: 8 }}>{flag.description}</div>}
        {flag.actions && flag.actions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
            {flag.actions.map((a) => (
              <button
                key={a.content}
                type="button"
                onClick={a.onPress}
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  font: 'inherit',
                  fontWeight: f.appearance === 'normal' ? 500 : 653,
                  color: t.action,
                  textDecoration: f.appearance === 'normal' ? 'none' : 'underline',
                  cursor: 'pointer',
                }}
              >
                {a.content}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        data-part="dismiss"
        onClick={onDismiss}
        style={{
          position: 'absolute',
          top: t.padding - 2,
          right: t.padding - 4,
          width: 24,
          height: 24,
          padding: 0,
          border: 'none',
          borderRadius: 4,
          background: 'none',
          cursor: 'pointer',
        }}
      >
        {[45, -45].map((angle) => (
          <span
            key={angle}
            aria-hidden
            style={{
              position: 'absolute',
              left: 6,
              top: 11,
              width: 12,
              height: 2,
              borderRadius: 1,
              background: t.title,
              transform: `rotate(${angle}deg)`,
            }}
          />
        ))}
      </button>
      {f.autoDismiss && (
        <motion.span
          aria-hidden
          data-part="progress"
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: t.progressHeight,
            background: t.progress,
            opacity: 0.5,
            originX: 0,
            scaleX: progress,
          }}
        />
      )}
    </motion.div>
  );
}
