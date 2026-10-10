import type { Theme } from '../../theme/types';
import { getCheckboxTokens, type CheckboxTokens } from '../Checkbox/Checkbox.tokens';

/** Radio shares the Checkbox's tokens, plus the size of the selected dot. */
export interface RadioTokens extends CheckboxTokens {
  dotSize: number;
}

export function getRadioTokens(theme: Theme): RadioTokens {
  return { ...getCheckboxTokens(theme), radius: 9999, dotSize: 6 };
}
