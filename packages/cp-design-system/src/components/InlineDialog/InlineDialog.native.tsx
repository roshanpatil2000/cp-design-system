import { Text } from 'react-native';
import { useComponent } from '../../theme/useComponent';
import { PopupBase } from '../Popup/Popup.native';
import { getPopupTokens, type PopupTokens } from '../Popup/Popup.types';
import type { InlineDialogProps } from './InlineDialog.types';

/**
 * A small dialog anchored to the element it explains, e.g. a help icon: padded content in a
 * floating card. Built on Popup, so it closes on Escape, outside clicks and Android back.
 */
export function InlineDialog(input: InlineDialogProps) {
  const {
    theme,
    props,
    tokens: t,
    spring,
  } = useComponent('InlineDialog', input, (theme): PopupTokens => ({
    ...getPopupTokens(theme),
    padding: 16,
    maxWidth: 400,
  }));
  return (
    <PopupBase
      {...props}
      role="dialog"
      trigger={props.children}
      content={
        typeof props.content === 'string' ? (
          <Text
            style={{
              color: theme.color['color.text'],
              fontSize: theme.text.body.fontSize,
              lineHeight: theme.text.body.lineHeight,
              fontFamily: theme.fontFamily.body,
            }}
          >
            {props.content}
          </Text>
        ) : (
          props.content
        )
      }
      tokens={t}
      animated={!!spring}
    />
  );
}
