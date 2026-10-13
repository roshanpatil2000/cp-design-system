import { cloneElement, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useComponent } from '../../theme/useComponent';
import { LINGER_MS, LONG_PRESS_MS, getTooltipTokens, type TooltipProps } from './Tooltip.types';

/**
 * A short label shown while the trigger is long-pressed (and briefly after). It listens to raw
 * touches without taking them, so the trigger still gets its own presses. The tooltip text is
 * also added as the trigger's accessibility hint.
 */
export function Tooltip(input: TooltipProps) {
  const { props, tokens: t, spring } = useComponent('Tooltip', input, getTooltipTokens);
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lingerTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      clearTimeout(pressTimer.current);
      clearTimeout(lingerTimer.current);
    },
    [],
  );

  const start = () => {
    clearTimeout(lingerTimer.current);
    pressTimer.current = setTimeout(() => setOpen(true), LONG_PRESS_MS);
  };
  const end = () => {
    clearTimeout(pressTimer.current);
    lingerTimer.current = setTimeout(() => setOpen(false), LINGER_MS);
  };
  const below = props.position === 'bottom';

  return (
    <View
      testID={props.testID}
      onTouchStart={start}
      onTouchEnd={end}
      onTouchCancel={end}
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
      style={{ alignSelf: 'flex-start', alignItems: 'center' }}
    >
      {cloneElement(props.children as React.ReactElement<Record<string, unknown>>, {
        accessibilityHint: props.content,
      })}
      {open ? (
        <Animated.View
          pointerEvents="none"
          entering={spring ? FadeIn.duration(150) : undefined}
          exiting={spring ? FadeOut.duration(100) : undefined}
          style={{
            position: 'absolute',
            ...(below ? { top: height + t.offset } : { bottom: height + t.offset }),
            left: -200,
            right: -200,
            alignItems: 'center',
            zIndex: 1000,
            elevation: 10,
          }}
        >
          <View
            testID={props.testID && `${props.testID}-tooltip`}
            style={{
              maxWidth: t.maxWidth,
              paddingHorizontal: t.paddingX,
              paddingVertical: t.paddingY,
              borderRadius: t.radius,
              backgroundColor: t.background,
            }}
          >
            <Text
              style={{
                color: t.text,
                fontSize: t.fontSize,
                lineHeight: t.lineHeight,
                fontFamily: t.fontFamily,
              }}
            >
              {props.content}
            </Text>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
