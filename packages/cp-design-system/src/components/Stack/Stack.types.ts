import type { BoxProps } from '../Box/Box.types';

export interface StackProps extends BoxProps {
  /** Space between children. Defaults to `3` (12px). */
  gap?: BoxProps['gap'];
}

export type DirectionalStackProps = Omit<StackProps, 'direction'>;
