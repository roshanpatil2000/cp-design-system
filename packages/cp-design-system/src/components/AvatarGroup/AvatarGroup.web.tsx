import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion, useTheme } from '../../theme/context';
import { Avatar } from '../Avatar/Avatar.web';
import { avatarGeometry, avatarSizes, getAvatarTokens } from '../Avatar/Avatar.types';
import { STACK_OVERLAP, splitGroup, type AvatarGroupProps } from './AvatarGroup.types';

/**
 * A row of avatars. Stacked avatars lift on hover; the "+N" button expands the group, and the
 * newly shown avatars pop in one after another.
 */
export function AvatarGroup(input: AvatarGroupProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const props = { ...theme.components.AvatarGroup?.defaultProps, ...input } as AvatarGroupProps;
  const [expanded, setExpanded] = useState(false);
  const sizeName = props.size ?? 'medium';
  const size = avatarSizes[sizeName];
  const stack = (props.appearance ?? 'stack') === 'stack';
  const { shown, hidden } = splitGroup(props.data, props.maxCount ?? 5, expanded);
  const t = getAvatarTokens(theme);
  const g = avatarGeometry(size, 'circle');
  const overlap = stack ? -Math.round(size * STACK_OVERLAP) : 0;
  const initialCount = Math.max(1, (props.maxCount ?? 5) - 1);

  return (
    <div
      role="group"
      aria-label={props.label ?? 'People'}
      data-testid={props.testID}
      style={{
        display: 'flex',
        flexWrap: stack ? 'nowrap' : 'wrap',
        alignItems: 'center',
        gap: stack ? 0 : 8,
        padding: t.ringWidth,
      }}
    >
      <AnimatePresence initial={false}>
        {shown.map((p, i) => (
          <motion.div
            key={p.key ?? p.name}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    type: 'spring',
                    ...theme.motion.springs.bouncy,
                    delay: Math.max(0, i - initialCount) * 0.04,
                  }
            }
            whileHover={stack && !reduceMotion ? { y: -4 } : undefined}
            style={{ marginLeft: i === 0 ? 0 : overlap, zIndex: shown.length - i, display: 'flex' }}
          >
            <Avatar
              name={p.name}
              src={p.src}
              presence={p.presence}
              onPress={p.onPress}
              size={sizeName}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      {hidden > 0 && (
        <button
          type="button"
          aria-label={`Show ${hidden} more`}
          data-part="more"
          onClick={() => (props.onMorePress ? props.onMorePress() : setExpanded(true))}
          style={{
            marginLeft: overlap,
            width: size,
            height: size,
            padding: 0,
            border: 'none',
            borderRadius: g.radius,
            boxShadow: `0 0 0 ${t.ringWidth}px ${t.ring}`,
            background: theme.color['color.background.neutral'],
            color: theme.color['color.text'],
            fontFamily: theme.fontFamily.body ?? 'inherit',
            fontSize: g.fontSize * 0.9,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          +{hidden}
        </button>
      )}
    </div>
  );
}
