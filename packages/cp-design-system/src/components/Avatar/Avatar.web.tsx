import { useState } from 'react';
import { motion } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import {
  avatarGeometry,
  avatarSizes,
  getAvatarTokens,
  initials,
  nameColors,
  presenceLabel,
  type AvatarProps,
} from './Avatar.types';

/** A picture of a person or project, falling back to colored initials. */
export function Avatar(input: AvatarProps) {
  const { theme, props, tokens: t, spring } = useComponent('Avatar', input, getAvatarTokens);
  const size = avatarSizes[props.size ?? 'medium'];
  const g = avatarGeometry(size, props.appearance ?? 'circle');
  const colors = nameColors(theme, props.name);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showImage = !!props.src && !failed;
  const label = props.presence ? `${props.name} (${presenceLabel[props.presence]})` : props.name;
  const presenceColor =
    props.presence &&
    {
      online: t.presenceOnline,
      busy: t.presenceBusy,
      focus: t.presenceFocus,
      offline: t.presenceOffline,
    }[props.presence];
  const pressable = !!props.onPress;

  const face = (
    <span
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: g.radius,
        overflow: 'hidden',
        background: t.background ?? colors.background,
        color: t.text ?? colors.text,
        fontFamily: t.fontFamily ?? 'inherit',
        fontSize: g.fontSize,
        fontWeight: t.fontWeight,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      {(!showImage || !loaded) && <span aria-hidden>{initials(props.name)}</span>}
      {showImage && (
        <motion.img
          src={props.src}
          alt=""
          data-part="image"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          initial={false}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={spring ? { duration: 0.2 } : { duration: 0 }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
    </span>
  );

  const content = (
    <>
      {face}
      {presenceColor && (
        <span
          aria-hidden
          data-part="presence"
          style={{
            position: 'absolute',
            right: -t.ringWidth / 2,
            bottom: -t.ringWidth / 2,
            width: g.dot,
            height: g.dot,
            boxSizing: 'border-box',
            borderRadius: '50%',
            background: presenceColor,
            border: `${t.ringWidth}px solid ${t.ring}`,
          }}
        />
      )}
    </>
  );

  const frame = {
    position: 'relative' as const,
    display: 'inline-flex',
    flexShrink: 0,
    padding: 0,
    border: 'none',
    borderRadius: g.radius + t.ringWidth,
    boxShadow: `0 0 0 ${t.ringWidth}px ${t.ring}`,
    background: 'none',
    verticalAlign: 'middle',
  };

  return pressable ? (
    <motion.button
      type="button"
      aria-label={label}
      disabled={props.isDisabled}
      data-testid={props.testID}
      onClick={props.onPress}
      whileTap={spring && !props.isDisabled ? { scale: t.pressedScale } : undefined}
      transition={spring ? { type: 'spring', ...spring } : { duration: 0 }}
      style={{
        ...frame,
        cursor: props.isDisabled ? 'not-allowed' : 'pointer',
        opacity: props.isDisabled ? 0.5 : 1,
      }}
    >
      {content}
    </motion.button>
  ) : (
    <span role="img" aria-label={label} data-testid={props.testID} style={frame}>
      {content}
    </span>
  );
}
