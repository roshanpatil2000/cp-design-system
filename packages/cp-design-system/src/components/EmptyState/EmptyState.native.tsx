import { View } from 'react-native';
import Animated, { Keyframe } from 'react-native-reanimated';
import { useComponent } from '../../theme/useComponent';
import { Heading } from '../Heading/Heading.native';
import { Spinner } from '../Spinner/Spinner.native';
import { Text } from '../Text/Text.native';
import { emptyStateWidths, type EmptyStateProps } from './EmptyState.types';

const riseIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 8 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }] },
}).duration(300);

/** A friendly placeholder for screens with nothing to show yet, with a way forward. */
export function EmptyState(input: EmptyStateProps) {
  const { theme, props, spring } = useComponent('EmptyState', input, () => ({}), 'gentle');
  const hasActions = props.primaryAction || props.secondaryAction || props.isLoading;
  return (
    <Animated.View
      testID={props.testID}
      entering={spring ? riseIn : undefined}
      style={{
        alignSelf: 'center',
        alignItems: 'center',
        gap: theme.space['200'],
        width: '100%',
        maxWidth: emptyStateWidths[props.width ?? 'wide'],
        paddingVertical: theme.space['600'],
        paddingHorizontal: theme.space['200'],
      }}
    >
      {props.image}
      <Heading size="medium" align="center">
        {props.header}
      </Heading>
      {props.description ? (
        <Text color="color.text.subtle" align="center">
          {props.description}
        </Text>
      ) : null}
      {hasActions ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space['100'] }}>
          {props.primaryAction}
          {props.secondaryAction}
          {props.isLoading ? <Spinner size="small" /> : null}
        </View>
      ) : null}
      {props.tertiaryAction}
    </Animated.View>
  );
}
