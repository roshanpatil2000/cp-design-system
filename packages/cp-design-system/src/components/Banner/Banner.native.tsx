import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { fontWeightFor } from '../../theme/createTheme';
import { useComponent } from '../../theme/useComponent';
import { StatusIcon } from '../internal/StatusIcon.native';
import { defaultBannerIcon, getBannerTokens, type BannerProps } from './Banner.types';

/** A full-width, page-level message, e.g. a system outage or an expiring trial. */
export function Banner(input: BannerProps) {
  const { props, tokens: t, spring } = useComponent('Banner', input, getBannerTokens, 'gentle');
  const appearance = props.appearance ?? 'warning';
  const icon = props.icon === false ? null : (props.icon ?? defaultBannerIcon[appearance]);
  if (!(props.isOpen ?? true)) return null;
  return (
    <Animated.View
      testID={props.testID}
      accessible
      accessibilityRole={appearance === 'announcement' ? 'summary' : 'alert'}
      accessibilityLiveRegion={appearance === 'announcement' ? 'polite' : 'assertive'}
      entering={spring ? FadeIn.duration(250) : undefined}
      exiting={spring ? FadeOut.duration(200) : undefined}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: t.gap,
        paddingHorizontal: t.paddingX,
        paddingVertical: t.paddingY,
        backgroundColor: t.background,
      }}
    >
      {icon ? (
        <View style={{ height: t.lineHeight, justifyContent: 'center' }}>
          <StatusIcon kind={icon} size={t.iconSize} color={t.icon} glyph={t.iconGlyph} />
        </View>
      ) : null}
      <Text
        style={{
          flexShrink: 1,
          color: t.text,
          fontFamily: t.fontFamily,
          fontSize: t.fontSize,
          lineHeight: t.lineHeight,
          fontWeight: fontWeightFor(t.fontWeight),
        }}
      >
        {props.children}
      </Text>
    </Animated.View>
  );
}
