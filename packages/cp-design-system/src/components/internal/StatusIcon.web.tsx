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
    <span
      aria-hidden
      data-part={`status-${kind}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
        background: color,
      }}
    >
      {l.bars.map((b, i) => (
        <span key={i} style={{ position: 'absolute', ...b, background: glyph }} />
      ))}
      {l.check && (
        <span
          style={{
            position: 'absolute',
            left: l.check.left,
            top: l.check.top,
            width: l.check.width,
            height: l.check.height,
            boxSizing: 'border-box',
            borderStyle: 'solid',
            borderColor: glyph,
            borderWidth: `0 ${l.check.stroke}px ${l.check.stroke}px 0`,
            transform: 'rotate(45deg)',
          }}
        />
      )}
    </span>
  );
}
