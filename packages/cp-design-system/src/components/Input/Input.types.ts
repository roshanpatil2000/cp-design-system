export interface InputProps {
  value?: string;
  defaultValue?: string;
  /** Called with the new text on every change (both platforms). */
  onChangeText?: (text: string) => void;
  placeholder?: string;
  /** Label shown above the field. */
  label?: string;
  /** Hint shown below the field. Replaced by `error` when present. */
  helperText?: string;
  /** Error message; also switches the border to the danger color. */
  error?: string;
  disabled?: boolean;
  /** Hide the text (password field). */
  secureTextEntry?: boolean;
  /** Maps to `<input type>` on web and `keyboardType` on native. */
  keyboardType?: 'default' | 'email' | 'number' | 'phone';
  testID?: string;
}
