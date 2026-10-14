import { useComponent } from '../../theme/useComponent';
import { getLozengeTokens, type LozengeProps } from './Lozenge.types';

/** A short status label, e.g. IN PROGRESS or DONE. */
export function Lozenge(input: LozengeProps) {
  const { props, tokens: t } = useComponent('Lozenge', input, getLozengeTokens);
  return (
    <span
      data-testid={props.testID}
      style={{
        display: 'inline-flex',
        // Keeps its own width inside flex columns (e.g. Stack) instead of stretching.
        width: 'fit-content',
        boxSizing: 'border-box',
        maxWidth: props.maxWidth ?? 200,
        padding: `0 ${t.paddingX}px`,
        borderRadius: t.radius,
        background: t.background,
        verticalAlign: 'baseline',
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
          fontWeight: t.fontWeight,
          textTransform: t.uppercase ? 'uppercase' : 'none',
        }}
      >
        {props.children}
      </span>
    </span>
  );
}
