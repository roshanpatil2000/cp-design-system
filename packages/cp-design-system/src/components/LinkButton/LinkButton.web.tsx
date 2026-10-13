import { withoutUndefined } from '../../theme/component';
import { useTheme } from '../../theme/context';
import { ButtonBase } from '../Button/Button.web';
import type { LinkButtonProps } from './LinkButton.types';

/**
 * Looks like a Button, behaves like a link: an `<a href>` on web (so it works with open-in-new-tab
 * and crawlers) and a link role that opens the URL on native.
 */
export function LinkButton(input: LinkButtonProps) {
  const theme = useTheme();
  const props = {
    ...theme.components.LinkButton?.defaultProps,
    ...withoutUndefined(input),
  } as LinkButtonProps;
  return <ButtonBase {...props} />;
}
