import { AnimatePresence, motion } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import { StatusIcon } from '../internal/StatusIcon.web';
import { defaultBannerIcon, getBannerTokens, type BannerProps } from './Banner.types';

/** A full-width, page-level message, e.g. a system outage or an expiring trial. */
export function Banner(input: BannerProps) {
  const { props, tokens: t, spring } = useComponent('Banner', input, getBannerTokens, 'gentle');
  const appearance = props.appearance ?? 'warning';
  const icon = props.icon === false ? null : (props.icon ?? defaultBannerIcon[appearance]);
  const transition = spring ? { duration: 0.25, ease: [0.4, 0, 0, 1] as const } : { duration: 0 };
  return (
    <AnimatePresence initial={false}>
      {(props.isOpen ?? true) && (
        <motion.div
          role={appearance === 'announcement' ? 'region' : 'alert'}
          aria-label={appearance === 'announcement' ? 'Announcement' : undefined}
          data-testid={props.testID}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={transition}
          style={{ overflow: 'hidden', background: t.background }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: t.gap,
              padding: `${t.paddingY}px ${t.paddingX}px`,
              color: t.text,
              fontFamily: t.fontFamily ?? 'inherit',
              fontSize: t.fontSize,
              lineHeight: `${t.lineHeight}px`,
              fontWeight: t.fontWeight,
            }}
          >
            {icon && (
              <span style={{ display: 'flex', height: t.lineHeight, alignItems: 'center' }}>
                <StatusIcon kind={icon} size={t.iconSize} color={t.icon} glyph={t.iconGlyph} />
              </span>
            )}
            <span>{props.children}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
