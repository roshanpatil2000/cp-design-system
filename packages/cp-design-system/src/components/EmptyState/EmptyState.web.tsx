import { motion } from 'motion/react';
import { useComponent } from '../../theme/useComponent';
import { Heading } from '../Heading/Heading.web';
import { Spinner } from '../Spinner/Spinner.web';
import { Text } from '../Text/Text.web';
import { emptyStateWidths, type EmptyStateProps } from './EmptyState.types';

/** A friendly placeholder for screens with nothing to show yet, with a way forward. */
export function EmptyState(input: EmptyStateProps) {
  const { theme, props, spring } = useComponent('EmptyState', input, () => ({}), 'gentle');
  const hasActions = props.primaryAction || props.secondaryAction || props.isLoading;
  return (
    <motion.div
      data-testid={props.testID}
      initial={spring ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={spring ? { duration: 0.3, ease: [0.4, 0, 0, 1] } : { duration: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.space['200'],
        maxWidth: emptyStateWidths[props.width ?? 'wide'],
        margin: '0 auto',
        padding: `${theme.space['600']}px 0`,
        textAlign: 'center',
      }}
    >
      {props.image}
      <Heading size="medium" as="h2">
        {props.header}
      </Heading>
      {props.description && (
        <Text as="p" color="color.text.subtle">
          {props.description}
        </Text>
      )}
      {hasActions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.space['100'] }}>
          {props.primaryAction}
          {props.secondaryAction}
          {props.isLoading && <Spinner size="small" />}
        </div>
      )}
      {props.tertiaryAction}
    </motion.div>
  );
}
