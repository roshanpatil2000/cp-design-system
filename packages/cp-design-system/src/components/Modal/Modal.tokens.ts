import type { Theme } from '../../theme/types';
import type { ModalAppearance, ModalWidth } from './Modal.types';

export const modalWidths: Record<ModalWidth, number> = {
  small: 400,
  medium: 600,
  large: 800,
  'x-large': 968,
};

/** Every visual value the Modal uses. Override any of them per theme or per instance. */
export interface ModalTokens {
  background: string;
  blanket: string;
  radius: number;
  /** Space above the dialog on wide screens. */
  offsetTop: number;
  /** Horizontal padding of header, body and footer. */
  paddingX: number;
  headerPaddingTop: number;
  headerPaddingBottom: number;
  footerPaddingTop: number;
  footerPaddingBottom: number;
  footerGap: number;
  title: string;
  titleFontSize: number;
  titleLineHeight: number;
  titleFontWeight: number;
  body: string;
  fontSize: number;
  lineHeight: number;
  fontFamily?: string;
  headingFontFamily?: string;
  iconWarning: string;
  iconDanger: string;
  iconGlyph: string;
  shadow: string;
  /** Distance the dialog slides while entering and leaving. */
  slide: number;
}

export function getModalTokens(theme: Theme): ModalTokens {
  const c = theme.color;
  const heading = theme.text['heading.medium'];
  return {
    background: c['elevation.surface.overlay'],
    blanket: c['color.blanket'],
    radius: theme.radius.xlarge,
    offsetTop: 60,
    paddingX: 24,
    headerPaddingTop: 24,
    headerPaddingBottom: 16,
    footerPaddingTop: 16,
    footerPaddingBottom: 24,
    footerGap: 8,
    title: c['color.text'],
    titleFontSize: heading.fontSize,
    titleLineHeight: heading.lineHeight,
    titleFontWeight: heading.fontWeight,
    body: c['color.text'],
    fontSize: theme.text.body.fontSize,
    lineHeight: theme.text.body.lineHeight,
    fontFamily: theme.fontFamily.body,
    headingFontFamily: theme.fontFamily.heading,
    iconWarning: c['color.icon.warning'],
    iconDanger: c['color.icon.danger'],
    iconGlyph: c['color.icon.inverse'],
    shadow:
      theme.mode === 'dark'
        ? '0 0 0 1px #BCD6F01F, 0 8px 12px #0304048F, 0 0 1px #03040480'
        : '0 8px 12px #1E1F2126, 0 0 1px #1E1F214F',
    slide: 16,
  };
}

export const modalIconColor = (t: ModalTokens, appearance?: ModalAppearance) =>
  appearance === 'danger' ? t.iconDanger : appearance === 'warning' ? t.iconWarning : null;
