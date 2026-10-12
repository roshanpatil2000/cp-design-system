import { View } from 'react-native';
import { useTheme } from '../../theme/context';
import type { ThemeColor } from '../../theme/types';
import { StatusIcon } from '../internal/StatusIcon.native';
import {
  iconLayout,
  iconSizes,
  isStatusGlyph,
  statusGlyphColor,
  type IconProps,
} from './Icon.types';

/** A small built-in icon set drawn with Views, sized and colored from the theme. */
export function Icon({ glyph, size = 'medium', color, label, testID }: IconProps) {
  const theme = useTheme();
  const px = typeof size === 'number' ? size : iconSizes[size];
  const fallback = isStatusGlyph(glyph) ? statusGlyphColor[glyph] : 'color.icon';
  const c = (color && theme.color[color as ThemeColor]) ?? color ?? theme.color[fallback];
  const a11y = label
    ? { accessible: true, accessibilityRole: 'image' as const, accessibilityLabel: label }
    : { accessible: false, importantForAccessibility: 'no-hide-descendants' as const };
  if (isStatusGlyph(glyph)) {
    return (
      <View {...a11y} testID={testID}>
        <StatusIcon kind={glyph} size={px} color={c} glyph={theme.color['color.icon.inverse']} />
      </View>
    );
  }
  const { stroke, parts } = iconLayout(glyph, px);
  return (
    <View {...a11y} testID={testID} style={{ width: px, height: px }}>
      {parts.map((p, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.width,
            height: p.height,
            transform: [{ rotate: `${p.rotate}deg` }],
            ...(p.kind === 'bar'
              ? { backgroundColor: c, borderRadius: stroke / 2 }
              : { borderColor: c, borderRightWidth: stroke, borderBottomWidth: stroke }),
          }}
        />
      ))}
    </View>
  );
}
