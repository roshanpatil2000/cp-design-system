import type { FieldLabelTokens } from './fieldLabelStyle';

/** Atlassian form label: 12/16 semibold, with a red asterisk for required fields. */
export function FieldLabel({
  label,
  isRequired,
  htmlFor,
  id,
  t,
}: {
  label: string;
  isRequired?: boolean;
  htmlFor?: string;
  id?: string;
  t: FieldLabelTokens;
}) {
  return (
    <label
      htmlFor={htmlFor}
      id={id}
      style={{
        alignSelf: 'flex-start',
        marginBottom: 4,
        color: t.labelColor,
        fontSize: t.labelFontSize,
        lineHeight: `${t.labelLineHeight}px`,
        fontWeight: t.labelFontWeight,
        fontFamily: t.fontFamily ?? 'inherit',
      }}
    >
      {label}
      {isRequired && (
        <span aria-hidden style={{ color: t.requiredColor, paddingLeft: 2 }}>
          *
        </span>
      )}
    </label>
  );
}
