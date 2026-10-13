import { Text } from 'react-native';
import { fontWeightFor } from '../../theme/createTheme';
import type { FieldLabelTokens } from './fieldLabelStyle';

/** Atlassian form label: 12/16 semibold, with a red asterisk for required fields. */
export function FieldLabel({
  label,
  isRequired,
  t,
}: {
  label: string;
  isRequired?: boolean;
  t: FieldLabelTokens;
}) {
  return (
    <Text
      style={{
        marginBottom: 4,
        color: t.labelColor,
        fontSize: t.labelFontSize,
        lineHeight: t.labelLineHeight,
        fontWeight: fontWeightFor(t.labelFontWeight),
        fontFamily: t.fontFamily,
      }}
    >
      {label}
      {isRequired ? <Text style={{ color: t.requiredColor }}> *</Text> : null}
    </Text>
  );
}
