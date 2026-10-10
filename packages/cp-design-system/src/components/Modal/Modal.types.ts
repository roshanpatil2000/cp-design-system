import type { ReactNode } from 'react';
import type { MotionOverride } from '../../theme/types';
import type { ModalTokens } from './Modal.tokens';

export type ModalWidth = 'small' | 'medium' | 'large' | 'x-large';
/** Adds a status icon before the title, for confirmations of risky actions. */
export type ModalAppearance = 'warning' | 'danger';

export interface ModalProps {
  isOpen: boolean;
  /** Called on Escape, a blanket click, or Android back. Set `isOpen` to false in response. */
  onClose: () => void;
  /** Heading of the dialog and its accessible name. */
  title: string;
  children?: ReactNode;
  /** Usually Buttons; laid out on the right with Atlassian's 8px gap. */
  footer?: ReactNode;
  /** 400, 600, 800 or 968 px, or a number. Defaults to `'medium'`. */
  width?: ModalWidth | number;
  appearance?: ModalAppearance;
  /** Defaults to `true`. */
  shouldCloseOnBlanketClick?: boolean;
  /** Web only. Defaults to `true`. */
  shouldCloseOnEscapePress?: boolean;
  /** Called after the exit animation finishes. */
  onCloseComplete?: () => void;
  /** Override any style token for this instance. */
  tokens?: Partial<ModalTokens>;
  /** `false` turns the enter/exit animation off. */
  motion?: MotionOverride;
  testID?: string;
}
