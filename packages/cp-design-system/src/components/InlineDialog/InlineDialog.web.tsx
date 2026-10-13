import { useComponent } from '../../theme/useComponent';
import { PopupBase } from '../Popup/Popup.web';
import { getPopupTokens, type PopupTokens } from '../Popup/Popup.types';
import type { InlineDialogProps } from './InlineDialog.types';

/**
 * A small dialog anchored to the element it explains, e.g. a help icon: padded content in a
 * floating card. Built on Popup, so it closes on Escape, outside clicks and Android back.
 */
export function InlineDialog(input: InlineDialogProps) {
  const {
    props,
    tokens: t,
    spring,
  } = useComponent('InlineDialog', input, (theme): PopupTokens => ({
    ...getPopupTokens(theme),
    padding: 16,
    maxWidth: 400,
  }));
  return (
    <PopupBase {...props} role="dialog" trigger={props.children} tokens={t} animated={!!spring} />
  );
}
