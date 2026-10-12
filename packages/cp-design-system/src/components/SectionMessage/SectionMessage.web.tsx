import { Fragment } from 'react';
import { useComponent } from '../../theme/useComponent';
import { StatusIcon } from '../internal/StatusIcon.web';
import {
  getSectionMessageTokens,
  sectionMessageIcon,
  type SectionMessageProps,
} from './SectionMessage.types';

/** A message about a section of the page, e.g. a form error summary or a tip. */
export function SectionMessage(input: SectionMessageProps) {
  const { props, tokens: t } = useComponent('SectionMessage', input, getSectionMessageTokens);
  const appearance = props.appearance ?? 'information';
  const icon = props.icon === false ? null : (props.icon ?? sectionMessageIcon[appearance]);
  return (
    <section
      data-testid={props.testID}
      data-appearance={appearance}
      aria-label={props.title}
      style={{
        display: 'flex',
        gap: t.gap,
        padding: t.padding,
        borderRadius: t.radius,
        background: t.background,
        color: t.text,
        fontFamily: t.fontFamily ?? 'inherit',
        fontSize: t.fontSize,
        lineHeight: `${t.lineHeight}px`,
      }}
    >
      {icon && (
        <span style={{ display: 'flex', height: t.lineHeight, alignItems: 'center' }}>
          <StatusIcon kind={icon} size={t.iconSize} color={t.icon} glyph={t.iconGlyph} />
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0, display: 'grid', gap: 8 }}>
        {props.title && (
          <h2 style={{ margin: 0, font: 'inherit', fontWeight: t.titleFontWeight, color: t.title }}>
            {props.title}
          </h2>
        )}
        {props.children && <div>{props.children}</div>}
        {props.actions && props.actions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {props.actions.map((a, i) => (
              <Fragment key={a.content}>
                {i > 0 && <span aria-hidden>·</span>}
                <button
                  type="button"
                  onClick={a.onPress}
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'none',
                    font: 'inherit',
                    color: t.action,
                    cursor: 'pointer',
                  }}
                >
                  {a.content}
                </button>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
