import { useState } from 'react';
import { Text, View } from 'react-native';
import { useHaptics, useTheme } from '../../theme/context';
import { withoutUndefined } from '../../theme/component';
import { ButtonBase } from '../Button/Button.native';
import { IconButton } from '../IconButton/IconButton.native';
import { pageItems, type PaginationProps } from './Pagination.types';

/** Page navigation: previous/next arrows and page numbers, collapsing long ranges with "…". */
export function Pagination(input: PaginationProps) {
  const theme = useTheme();
  const haptics = useHaptics();
  const props = {
    ...theme.components.Pagination?.defaultProps,
    ...withoutUndefined(input),
  } as PaginationProps;
  const [internal, setInternal] = useState(props.defaultSelectedIndex ?? 0);
  const current = Math.min(props.pages - 1, Math.max(0, props.selectedIndex ?? internal));
  const go = (index: number) => {
    if (index < 0 || index >= props.pages || index === current) return;
    if (props.selectedIndex === undefined) setInternal(index);
    haptics('selection');
    props.onChange?.(index);
  };
  const pageLabel = props.pageLabel ?? ((n: number) => `Page ${n}`);

  return (
    <View
      testID={props.testID}
      accessibilityLabel={props.label ?? 'Pagination'}
      style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}
    >
      <IconButton
        icon="chevron-left"
        label={props.previousLabel ?? 'Previous'}
        appearance="subtle"
        isDisabled={current === 0}
        onPress={() => go(current - 1)}
      />
      {pageItems(props.pages, current, props.max).map((item, i) =>
        item === '…' ? (
          <Text
            key={`gap-${i}`}
            style={{ minWidth: 24, textAlign: 'center', color: theme.color['color.text.subtle'] }}
          >
            …
          </Text>
        ) : (
          <ButtonBase
            key={item}
            appearance="subtle"
            isCurrent={item === current}
            accessibilityLabel={pageLabel(item + 1)}
            onPress={() => go(item)}
            tokens={{ paddingX: 8 }}
            testID={props.testID && `${props.testID}-page-${item + 1}`}
          >
            {String(item + 1)}
          </ButtonBase>
        ),
      )}
      <IconButton
        icon="chevron-right"
        label={props.nextLabel ?? 'Next'}
        appearance="subtle"
        isDisabled={current === props.pages - 1}
        onPress={() => go(current + 1)}
      />
    </View>
  );
}
