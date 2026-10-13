import { useState } from 'react';
import { useTheme } from '../../theme/context';
import { getBreadcrumbsTokens, visibleCrumbs, type BreadcrumbsProps } from './Breadcrumbs.types';

/**
 * A trail of links to the current page. Long trails collapse into "…", which expands in place.
 */
export function Breadcrumbs(props: BreadcrumbsProps) {
  const theme = useTheme();
  const t = getBreadcrumbsTokens(theme);
  const [expanded, setExpanded] = useState(false);
  const crumbs = visibleCrumbs(
    props.items,
    expanded,
    props.maxItems,
    props.itemsBeforeCollapse,
    props.itemsAfterCollapse,
  );
  const text = {
    fontFamily: t.fontFamily ?? 'inherit',
    fontSize: t.fontSize,
    lineHeight: `${t.lineHeight}px`,
  };
  const linkStyle = {
    ...text,
    padding: 0,
    border: 'none',
    background: 'none',
    color: t.link,
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return (
    <nav aria-label={props.label ?? 'Breadcrumbs'} data-testid={props.testID}>
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {crumbs.map((item, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li
              key={item ? `${i}-${item.label}` : 'more'}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {item === null ? (
                <button
                  type="button"
                  aria-label="Show more breadcrumbs"
                  onClick={() => setExpanded(true)}
                  style={linkStyle}
                >
                  …
                </button>
              ) : item.href ? (
                <a
                  href={item.href}
                  aria-current={last ? 'page' : undefined}
                  onClick={item.onPress}
                  style={{ ...linkStyle, color: last ? t.current : t.link }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {item.label}
                </a>
              ) : item.onPress ? (
                <button
                  type="button"
                  aria-current={last ? 'page' : undefined}
                  onClick={item.onPress}
                  style={{ ...linkStyle, color: last ? t.current : t.link }}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  style={{ ...text, color: t.current }}
                >
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden style={{ ...text, color: t.separator, padding: '0 8px' }}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
