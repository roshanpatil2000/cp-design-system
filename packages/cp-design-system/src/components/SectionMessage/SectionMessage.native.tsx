import { Fragment } from 'react';
import { Pressable, Text, View } from 'react-native';
import { fontWeightFor } from '../../theme/createTheme';
import { useComponent } from '../../theme/useComponent';
import { StatusIcon } from '../internal/StatusIcon.native';
import {
  getSectionMessageTokens,
  sectionMessageIcon,
  type SectionMessageProps,
} from './SectionMessage.types';

/** A message about a section of the screen, e.g. a form error summary or a tip. */
export function SectionMessage(input: SectionMessageProps) {
  const { props, tokens: t } = useComponent('SectionMessage', input, getSectionMessageTokens);
  const appearance = props.appearance ?? 'information';
  const icon = props.icon === false ? null : (props.icon ?? sectionMessageIcon[appearance]);
  const text = { fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight };
  return (
    <View
      testID={props.testID}
      style={{
        flexDirection: 'row',
        gap: t.gap,
        padding: t.padding,
        borderRadius: t.radius,
        backgroundColor: t.background,
      }}
    >
      {icon ? (
        <View style={{ height: t.lineHeight, justifyContent: 'center' }}>
          <StatusIcon kind={icon} size={t.iconSize} color={t.icon} glyph={t.iconGlyph} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 8 }}>
        {props.title ? (
          <Text
            accessibilityRole="header"
            style={{ ...text, color: t.title, fontWeight: fontWeightFor(t.titleFontWeight) }}
          >
            {props.title}
          </Text>
        ) : null}
        {typeof props.children === 'string' ? (
          <Text style={{ ...text, color: t.text }}>{props.children}</Text>
        ) : (
          props.children
        )}
        {props.actions?.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {props.actions.map((a, i) => (
              <Fragment key={a.content}>
                {i > 0 ? <Text style={{ ...text, color: t.text }}>·</Text> : null}
                <Pressable accessibilityRole="button" onPress={a.onPress} hitSlop={6}>
                  <Text style={{ ...text, color: t.action }}>{a.content}</Text>
                </Pressable>
              </Fragment>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}
