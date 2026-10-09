import type { Theme } from '../../theme/themes';
import type { BoxProps, Dimension } from './Box.types';

/** Style keys that mean the same thing in CSS and React Native. */
export interface BoxStyle {
  flexDirection: 'row' | 'column';
  flexWrap?: 'wrap' | 'nowrap';
  flex?: number;
  alignItems?: BoxProps['align'];
  justifyContent?: BoxProps['justify'];
  gap?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  backgroundColor?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid';
  width?: Dimension;
  height?: Dimension;
}

export function getBoxStyle(props: BoxProps, theme: Theme): BoxStyle {
  const s = theme.spacing;
  const padX = props.px ?? props.p;
  const padY = props.py ?? props.p;
  const marX = props.mx ?? props.m;
  const marY = props.my ?? props.m;

  const style: BoxStyle = { flexDirection: props.direction ?? 'column' };
  if (props.wrap) style.flexWrap = 'wrap';
  if (props.flex !== undefined) style.flex = props.flex;
  if (props.align) style.alignItems = props.align;
  if (props.justify) style.justifyContent = props.justify;
  if (props.gap !== undefined) style.gap = s[props.gap];
  if (padY !== undefined) style.paddingTop = style.paddingBottom = s[padY];
  if (padX !== undefined) style.paddingLeft = style.paddingRight = s[padX];
  if (marY !== undefined) style.marginTop = style.marginBottom = s[marY];
  if (marX !== undefined) style.marginLeft = style.marginRight = s[marX];
  if (props.bg) style.backgroundColor = theme.colors[props.bg];
  if (props.radius) style.borderRadius = theme.radii[props.radius];
  if (props.borderColor || props.borderWidth) {
    style.borderColor = theme.colors[props.borderColor ?? 'border'];
    style.borderWidth = props.borderWidth ?? 1;
    style.borderStyle = 'solid';
  }
  if (props.width !== undefined) style.width = props.width;
  if (props.height !== undefined) style.height = props.height;
  return style;
}
