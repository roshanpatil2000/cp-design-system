/**
 * Font for content portaled to `document.body` (flags, modals) when the theme leaves the body
 * font to the platform. In-flow components inherit the page font instead, but portaled ones
 * would otherwise fall back to the browser default (often a serif).
 */
export const systemFontStack =
  'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
