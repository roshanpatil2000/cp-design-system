import { useCallback, useRef, useState } from 'react';
import { useHaptics } from '../../theme/context';
import { useComponent } from '../../theme/useComponent';
import { getTabsTokens, type TabsProps } from './Tabs.types';

export function useTabs(input: TabsProps) {
  const c = useComponent('Tabs', input, getTabsTokens);
  const haptics = useHaptics();
  const { props } = c;
  const firstEnabled = props.tabs.find((t) => !t.isDisabled)?.id;
  const [internal, setInternal] = useState(props.defaultSelected ?? firstEnabled);
  const selected = props.selected ?? internal;
  const selectedIndex = Math.max(
    0,
    props.tabs.findIndex((t) => t.id === selected),
  );

  const latest = useRef(props);
  latest.current = props;
  const select = useCallback(
    (id: string) => {
      const p = latest.current;
      const tab = p.tabs.find((t) => t.id === id);
      if (!tab || tab.isDisabled) return;
      if (p.selected === undefined) setInternal(id);
      haptics('selection');
      p.onChange?.(id);
    },
    [haptics],
  );

  /** Next enabled tab index from `from`, wrapping, for arrow-key navigation. */
  const step = (from: number, dir: 1 | -1) => {
    const n = props.tabs.length;
    for (let i = 1; i <= n; i++) {
      const idx = (((from + dir * i) % n) + n) % n;
      if (!props.tabs[idx]?.isDisabled) return idx;
    }
    return from;
  };

  return { ...c, selected, selectedIndex, select, step };
}
