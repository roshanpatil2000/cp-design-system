import { Box } from '../Box/Box.web';
import type { DirectionalStackProps, StackProps } from './Stack.types';

export function Stack({ gap = 3, ...rest }: StackProps) {
  return <Box gap={gap} {...rest} />;
}

/** Vertical stack. */
export function VStack(props: DirectionalStackProps) {
  return <Stack {...props} direction="column" />;
}

/** Horizontal stack, vertically centered by default. */
export function HStack({ align = 'center', ...rest }: DirectionalStackProps) {
  return <Stack align={align} {...rest} direction="row" />;
}
