import type { ReactNode } from 'react';
import type { PopupProps } from '../Popup/Popup.types';

export interface InlineDialogProps extends Omit<PopupProps, 'trigger' | 'role' | 'width'> {
  /** The element the dialog points at, e.g. a help icon button. */
  children: ReactNode;
}
