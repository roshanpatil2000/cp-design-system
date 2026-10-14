import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { IconButton } from '../IconButton/IconButton.web';
import { ProgressIndicator } from '../ProgressIndicator/ProgressIndicator.web';
import {
  landingIndex,
  slidePx,
  trackOffset,
  type CarouselProps,
  type CarouselTokens,
} from './Carousel.types';
import { useCarousel } from './useCarousel';

/** One slide: scales and fades with its distance from the center while the track moves. */
function Slide({
  x,
  i,
  slide,
  gap,
  viewport,
  t,
  label,
  current,
  children,
}: {
  x: MotionValue<number>;
  i: number;
  slide: number;
  gap: number;
  viewport: number;
  t: CarouselTokens;
  label: string;
  current: boolean;
  children: ReactNode;
}) {
  // 0 when centered, 1 when one slide away.
  const distance = useTransform(x, (v) =>
    Math.min(1, Math.abs(v - trackOffset(i, slide, gap, viewport)) / (slide + gap)),
  );
  const scale = useTransform(distance, (d) => 1 - (1 - t.inactiveScale) * d);
  const opacity = useTransform(distance, (d) => 1 - (1 - t.inactiveOpacity) * d);
  const peek = slide < viewport;
  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      aria-hidden={!current || undefined}
      data-part="slide"
      inert={!current || undefined}
      style={{
        flex: `0 0 ${slide}px`,
        width: slide,
        scale: peek ? scale : 1,
        opacity: peek ? opacity : 1,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A row of slides you can drag, swipe, click through or move with arrow keys. Slides snap with
 * a spring; with a narrower `slideWidth` the neighbours peek in, slightly scaled and faded.
 */
export function Carousel(input: CarouselProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const c = useCarousel(input, hovered || focused || dragging);
  const { props, tokens: t, spring, theme } = c;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState(0);
  const gap = theme.space[props.space ?? '200'];
  const slide = slidePx(props.slideWidth, viewport);
  const x = useMotionValue(0);
  const dragStart = useRef(0);
  const placed = useRef(false);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewport(el.clientWidth);
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);

  // Snap the track to the current slide: instantly the first time, with the spring afterwards.
  useEffect(() => {
    if (viewport === 0 || dragging) return;
    const target = trackOffset(c.index, slide, gap, viewport);
    if (!placed.current || !spring) {
      placed.current = true;
      x.set(target);
      return;
    }
    const controls = animate(x, target, { type: 'spring', ...spring });
    return () => controls.stop();
  }, [c.index, slide, gap, viewport, spring, dragging, x]);

  const showArrows = props.showArrows ?? true;
  const showDots = props.showDots ?? true;
  const min = trackOffset(c.count - 1, slide, gap, viewport);
  const max = trackOffset(0, slide, gap, viewport);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={props.label}
      data-testid={props.testID}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          c.next();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          c.prev();
        }
      }}
      style={{ position: 'relative' }}
    >
      <div
        ref={viewportRef}
        aria-live={c.autoPlaying ? 'off' : 'polite'}
        style={{ overflow: 'hidden', touchAction: 'pan-y' }}
      >
        <motion.div
          data-part="track"
          drag={c.count > 1 ? 'x' : false}
          dragConstraints={{ left: min, right: max }}
          dragElastic={0.15}
          dragMomentum={false}
          onDragStart={() => {
            dragStart.current = x.get();
            setDragging(true);
          }}
          onDragEnd={(_e, info) => {
            const dragged = x.get() - dragStart.current;
            setDragging(false);
            const target = landingIndex(c.index, dragged, info.velocity.x, slide + gap, t);
            if (target === c.index || (!props.loop && (target < 0 || target >= c.count))) {
              // Spring back to where we were.
              animate(x, trackOffset(c.index, slide, gap, viewport), {
                type: 'spring',
                ...(spring ?? { stiffness: 1000, damping: 100, mass: 1 }),
              });
            } else {
              c.go(target);
            }
          }}
          style={{
            display: 'flex',
            gap,
            x,
            cursor: c.count > 1 ? (dragging ? 'grabbing' : 'grab') : undefined,
            userSelect: dragging ? 'none' : undefined,
          }}
        >
          {c.slides.map((child, i) => (
            <Slide
              key={child.key ?? i}
              x={x}
              i={i}
              slide={slide}
              gap={gap}
              viewport={viewport}
              t={t}
              label={c.slideLabel(i, c.count)}
              current={i === c.index}
            >
              {child}
            </Slide>
          ))}
        </motion.div>
      </div>
      {(showArrows || showDots) && c.count > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: showArrows ? 'space-between' : 'center',
            gap: 8,
            marginTop: t.dotsGap,
          }}
        >
          {showArrows && (
            <IconButton
              icon="chevron-left"
              label="Previous slide"
              shape="circle"
              isDisabled={!c.canPrev}
              onPress={c.prev}
            />
          )}
          {showDots && (
            <ProgressIndicator
              count={c.count}
              selectedIndex={c.index}
              onSelect={c.go}
              appearance="primary"
              stepLabel={(i, n) => `Go to slide ${i + 1} of ${n}`}
            />
          )}
          {showArrows && (
            <IconButton
              icon="chevron-right"
              label="Next slide"
              shape="circle"
              isDisabled={!c.canNext}
              onPress={c.next}
            />
          )}
        </div>
      )}
    </section>
  );
}
