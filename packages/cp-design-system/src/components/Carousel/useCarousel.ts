import { Children, isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import { useHaptics } from '../../theme/context';
import { useComponent } from '../../theme/useComponent';
import { defaultSlideLabel, getCarouselTokens, type CarouselProps } from './Carousel.types';

/** Platform-independent Carousel behaviour: slides, index, looping and autoplay. */
export function useCarousel(input: CarouselProps, paused: boolean) {
  const c = useComponent('Carousel', input, getCarouselTokens, 'gentle');
  const haptics = useHaptics();
  const { props } = c;
  const slides = Children.toArray(props.children).filter(isValidElement);
  const count = slides.length;
  const [internal, setInternal] = useState(props.defaultIndex ?? 0);
  const index = Math.min(Math.max(0, props.index ?? internal), Math.max(0, count - 1));

  const latest = useRef({ props, index, count });
  latest.current = { props, index, count };

  /** Moves to slide `target` (wrapping when looping, clamped otherwise). */
  const go = useCallback(
    (target: number) => {
      const l = latest.current;
      if (l.count === 0) return;
      const next = l.props.loop
        ? ((target % l.count) + l.count) % l.count
        : Math.min(Math.max(0, target), l.count - 1);
      if (next === l.index) return;
      if (l.props.index === undefined) setInternal(next);
      haptics('selection');
      l.props.onIndexChange?.(next);
    },
    [haptics],
  );
  const next = useCallback(() => go(latest.current.index + 1), [go]);
  const prev = useCallback(() => go(latest.current.index - 1), [go]);

  // Autoplay: advance every `autoPlay` ms unless paused, reduced motion, or at the end without loop.
  const autoPlay = c.reduceMotion ? undefined : props.autoPlay;
  useEffect(() => {
    if (!autoPlay || paused || count < 2) return;
    const id = setInterval(() => {
      const l = latest.current;
      if (!l.props.loop && l.index >= l.count - 1) return;
      go(l.index + 1);
    }, autoPlay);
    return () => clearInterval(id);
  }, [autoPlay, paused, count, go]);

  return {
    ...c,
    slides,
    count,
    index,
    go,
    next,
    prev,
    canPrev: !!props.loop || index > 0,
    canNext: !!props.loop || index < count - 1,
    slideLabel: props.slideLabel ?? defaultSlideLabel,
    autoPlaying: !!autoPlay && !paused,
  };
}
