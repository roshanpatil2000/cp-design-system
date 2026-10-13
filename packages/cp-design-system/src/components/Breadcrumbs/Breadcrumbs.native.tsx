import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useReducedMotion, useTheme } from '../../theme/context';
import { getBreadcrumbsTokens, visibleCrumbs, type BreadcrumbsProps } from './Breadcrumbs.types';

/**
 * A trail of links to the current screen. Long trails collapse into "…", which expands in place.
 */
export function Breadcrumbs(props: BreadcrumbsProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const t = getBreadcrumbsTokens(theme);
  const [expanded, setExpanded] = useState(false);
  const crumbs = visibleCrumbs(
    props.items,
    expanded,
    props.maxItems,
    props.itemsBeforeCollapse,
    props.itemsAfterCollapse,
  );
  const text = { fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight };

  return (
    <View
      testID={props.testID}
      accessibilityLabel={props.label ?? 'Breadcrumbs'}
      style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}
    >
      {crumbs.map((item, i) => {
        const last = i === crumbs.length - 1;
        const press =
          item?.onPress ?? (item?.href ? () => void Linking.openURL(item.href!) : undefined);
        return (
          <Animated.View
            key={item ? `${i}-${item.label}` : 'more'}
            entering={expanded && !reduceMotion ? FadeIn.duration(200) : undefined}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            {item === null ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Show more breadcrumbs"
                hitSlop={10}
                onPress={() => setExpanded(true)}
              >
                <Text style={{ ...text, color: t.link }}>…</Text>
              </Pressable>
            ) : press && !last ? (
              <Pressable accessibilityRole="link" hitSlop={8} onPress={press}>
                <Text style={{ ...text, color: t.link }}>{item.label}</Text>
              </Pressable>
            ) : (
              <Text
                accessibilityRole="text"
                accessibilityState={{ selected: last }}
                style={{ ...text, color: t.current, fontWeight: last ? '500' : '400' }}
              >
                {item.label}
              </Text>
            )}
            {!last ? (
              <Text
                importantForAccessibility="no"
                accessibilityElementsHidden
                style={{ ...text, color: t.separator, paddingHorizontal: 8 }}
              >
                /
              </Text>
            ) : null}
          </Animated.View>
        );
      })}
    </View>
  );
}
