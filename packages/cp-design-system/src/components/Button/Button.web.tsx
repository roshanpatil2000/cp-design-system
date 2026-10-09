import { useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Spinner } from '../Spinner/Spinner.web';
import type { ButtonProps } from './Button.types';
import { useButton } from './useButton';

const isActivationKey = (e: KeyboardEvent) => e.key === ' ' || e.key === 'Enter';

export function Button(input: ButtonProps) {
  const b = useButton(input);
  const { props, tokens: t, spring, reduceMotion, theme, interactive } = b;
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const background = !interactive
    ? b.background
    : pressed
      ? t.backgroundPressed
      : hovered
        ? t.backgroundHovered
        : t.background;
  const colorTransition = reduceMotion
    ? { duration: 0 }
    : // Atlassian's motion.button.hovered / pressed: 150ms, out-practical easing.
      {
        duration: 0.15,
        ease: [...theme.motion.easings['out.practical']] as [number, number, number, number],
      };
  const fade = reduceMotion ? { duration: 0 } : { duration: 0.15 };

  const release = () => setPressed(false);

  return (
    <motion.button
      type={props.type ?? 'button'}
      data-testid={props.testID}
      aria-label={props.accessibilityLabel}
      aria-pressed={props.isSelected === undefined ? undefined : b.isSelected}
      aria-busy={b.isLoading || undefined}
      // Loading buttons stay focusable (so focus isn't lost mid-action) but announce as disabled.
      aria-disabled={b.isLoading || undefined}
      disabled={b.isDisabled}
      initial={false}
      animate={{
        backgroundColor: background,
        scale: pressed && spring ? t.pressScale : 1,
      }}
      transition={{
        backgroundColor: colorTransition,
        scale: spring ? { type: 'spring', ...spring } : { duration: 0 },
      }}
      onClick={(e) => {
        if (!interactive) {
          e.preventDefault();
          return;
        }
        b.press();
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        release();
      }}
      onPointerDown={(e) => interactive && e.button === 0 && setPressed(true)}
      onPointerUp={release}
      onPointerCancel={release}
      onKeyDown={(e) => interactive && isActivationKey(e) && !e.repeat && setPressed(true)}
      onKeyUp={(e) => isActivationKey(e) && release()}
      onFocus={(e) => setFocusVisible(e.currentTarget.matches?.(':focus-visible') ?? true)}
      onBlur={() => {
        setFocusVisible(false);
        release();
      }}
      style={{
        position: 'relative',
        display: props.shouldFitContainer ? 'flex' : 'inline-flex',
        width: props.shouldFitContainer ? '100%' : 'auto',
        maxWidth: '100%',
        flexShrink: 0,
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'center',
        height: t.height,
        padding: `0 ${t.paddingX}px`,
        margin: 0,
        border: 'none',
        borderRadius: t.radius,
        // Inset shadow draws the border without changing the button's size.
        boxShadow:
          b.borderColor === 'transparent'
            ? 'none'
            : `inset 0 0 0 ${t.borderWidth}px ${b.borderColor}`,
        color: b.textColor,
        fontFamily: t.fontFamily ?? 'inherit',
        fontSize: t.fontSize,
        lineHeight: `${t.lineHeight}px`,
        fontWeight: t.fontWeight,
        whiteSpace: 'nowrap',
        cursor: b.isDisabled ? 'not-allowed' : b.isLoading ? 'progress' : 'pointer',
        outline: focusVisible ? `${t.focusRingWidth}px solid ${t.focusRing}` : 'none',
        outlineOffset: t.focusRingGap,
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      <motion.span
        data-part="content"
        initial={false}
        animate={{ opacity: b.isLoading ? 0 : 1, scale: b.isLoading && !reduceMotion ? 0.92 : 1 }}
        transition={fade}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.gap,
          minWidth: 0,
        }}
      >
        {props.iconBefore && (
          <span data-part="icon-before" style={{ display: 'inline-flex', flexShrink: 0 }}>
            {b.renderIcon(props.iconBefore)}
          </span>
        )}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
          {props.children}
        </span>
        {props.iconAfter && (
          <span data-part="icon-after" style={{ display: 'inline-flex', flexShrink: 0 }}>
            {b.renderIcon(props.iconAfter)}
          </span>
        )}
      </motion.span>
      <AnimatePresence>
        {b.isLoading && (
          <motion.span
            key="spinner"
            data-part="loading"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, scale: 0.6 }
            }
            transition={fade}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spinner size={t.spinnerSize} color={b.textColor} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
