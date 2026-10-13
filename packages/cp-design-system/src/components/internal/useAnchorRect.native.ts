import { useEffect, useState, type RefObject } from 'react';
import { Platform, StatusBar, type View } from 'react-native';
import type { Rect } from './placement';

/**
 * Measures an anchor in window coordinates when `isOpen` turns on, in the coordinate space of a
 * translucent-status-bar Modal (Android measures below the status bar; the Modal starts above it).
 */
export function useAnchorRect(isOpen: boolean, anchorRef: RefObject<View | null>) {
  const [rect, setRect] = useState<Rect | null>(null);
  useEffect(() => {
    if (!isOpen) {
      setRect(null);
      return;
    }
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      const offset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
      setRect({ x, y: y + offset, width, height });
    });
  }, [isOpen, anchorRef]);
  return rect;
}
