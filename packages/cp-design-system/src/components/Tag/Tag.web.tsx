import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import { Icon } from '../Icon/Icon.web';
import { getTagTokens, type TagProps } from './Tag.types';

/** A label for categorizing, filtering or showing selections. Removable tags shrink away. */
export function Tag(input: TagProps) {
  const { props, tokens: t, spring } = useComponent('Tag', input, getTagTokens);
  const [removed, setRemoved] = useState(false);
  const [removeHovered, setRemoveHovered] = useState(false);
  const exit = spring ? { duration: 0.15 } : { duration: 0 };
  return (
    <AnimatePresence initial={false} onExitComplete={() => props.onRemove?.()}>
      {!removed && (
        <motion.span
          data-testid={props.testID}
          exit={{ opacity: 0, scale: 0.8, transition: exit }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            boxSizing: 'border-box',
            height: t.height,
            maxWidth: t.maxWidth,
            paddingLeft: t.paddingX,
            paddingRight: props.isRemovable ? 0 : t.paddingX,
            borderRadius: t.radius,
            background: removeHovered ? t.removeHovered : t.background,
            transition: 'background-color 150ms',
            verticalAlign: 'middle',
          }}
        >
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: t.text,
              fontFamily: t.fontFamily ?? 'inherit',
              fontSize: t.fontSize,
              lineHeight: `${t.lineHeight}px`,
            }}
          >
            {props.text}
          </span>
          {props.isRemovable && (
            <button
              type="button"
              aria-label={props.removeButtonLabel ?? `Remove ${props.text}`}
              onClick={() => setRemoved(true)}
              onPointerEnter={() => setRemoveHovered(true)}
              onPointerLeave={() => setRemoveHovered(false)}
              onFocus={() => setRemoveHovered(true)}
              onBlur={() => setRemoveHovered(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: t.height,
                height: t.height,
                padding: 0,
                border: 'none',
                borderRadius: t.radius,
                background: 'none',
                cursor: 'pointer',
              }}
            >
              <Icon glyph="cross" size={10} color={t.text} />
            </button>
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
