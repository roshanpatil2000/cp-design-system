import { Text, View } from 'react-native';
import { fontWeightFor } from '../../theme/createTheme';
import { useComponent } from '../../theme/useComponent';
import { getLozengeTokens, type LozengeProps } from './Lozenge.types';

/** A short status label, e.g. IN PROGRESS or DONE. */
export function Lozenge(input: LozengeProps) {
  const { props, tokens: t } = useComponent('Lozenge', input, getLozengeTokens);
  return (
    <View
      testID={props.testID}
      style={{
        alignSelf: 'flex-start',
        maxWidth: props.maxWidth ?? 200,
        paddingHorizontal: t.paddingX,
        borderRadius: t.radius,
        backgroundColor: t.background,
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          color: t.text,
          fontFamily: t.fontFamily,
          fontSize: t.fontSize,
          lineHeight: t.lineHeight,
          fontWeight: fontWeightFor(t.fontWeight),
          textTransform: t.uppercase ? 'uppercase' : 'none',
        }}
      >
        {props.children}
      </Text>
    </View>
  );
}
