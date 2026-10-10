import { View } from 'react-native';
import { statusIconLayout, type StatusKind } from './statusIconLayout';

export function StatusIcon({
  kind,
  size,
  color,
  glyph,
}: {
  kind: StatusKind;
  size: number;
  color: string;
  glyph: string;
}) {
  const l = statusIconLayout(kind, size);
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }}>
      {l.bars.map((b, i) => (
        <View key={i} style={{ position: 'absolute', ...b, backgroundColor: glyph }} />
      ))}
      {l.check ? (
        <View
          style={{
            position: 'absolute',
            left: l.check.left,
            top: l.check.top,
            width: l.check.width,
            height: l.check.height,
            borderColor: glyph,
            borderRightWidth: l.check.stroke,
            borderBottomWidth: l.check.stroke,
            transform: [{ rotate: '45deg' }],
          }}
        />
      ) : null}
    </View>
  );
}
