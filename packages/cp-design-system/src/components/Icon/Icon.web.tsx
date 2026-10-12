import { useTheme } from '../../theme/context';
import type { ThemeColor } from '../../theme/types';
import { StatusIcon } from '../internal/StatusIcon.web';
import {
  iconLayout,
  iconSizes,
  isStatusGlyph,
  statusGlyphColor,
  type IconProps,
} from './Icon.types';

/** A small built-in icon set drawn with CSS, sized and colored from the theme. */
export function Icon({ glyph, size = 'medium', color, label, testID }: IconProps) {
  const theme = useTheme();
  const px = typeof size === 'number' ? size : iconSizes[size];
  const fallback = isStatusGlyph(glyph) ? statusGlyphColor[glyph] : 'color.icon';
  const c = (color && theme.color[color as ThemeColor]) ?? color ?? theme.color[fallback];
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  if (isStatusGlyph(glyph)) {
    return (
      <span {...a11y} data-testid={testID} data-glyph={glyph} style={{ display: 'inline-flex' }}>
        <StatusIcon kind={glyph} size={px} color={c} glyph={theme.color['color.icon.inverse']} />
      </span>
    );
  }
  const { stroke, parts } = iconLayout(glyph, px);
  return (
    <span
      {...a11y}
      data-testid={testID}
      data-glyph={glyph}
      style={{
        position: 'relative',
        display: 'inline-block',
        flexShrink: 0,
        width: px,
        height: px,
      }}
    >
      {parts.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            boxSizing: 'border-box',
            left: p.left,
            top: p.top,
            width: p.width,
            height: p.height,
            transform: `rotate(${p.rotate}deg)`,
            ...(p.kind === 'bar'
              ? { background: c, borderRadius: stroke / 2 }
              : {
                  borderStyle: 'solid',
                  borderColor: c,
                  borderWidth: `0 ${stroke}px ${stroke}px 0`,
                }),
          }}
        />
      ))}
    </span>
  );
}
