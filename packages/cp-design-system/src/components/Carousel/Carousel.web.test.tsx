import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel, type CarouselProps } from '../../index.web';
import { landingIndex, slidePx, trackOffset } from './Carousel.types';
import { renderThemed } from '../internal/testUtils.web';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const slides = ['One', 'Two', 'Three', 'Four'].map((t) => <div key={t}>{t}</div>);

function setup(props: Partial<CarouselProps> = {}, motion: 'full' | 'reduced' = 'reduced') {
  const onIndexChange = vi.fn();
  renderThemed(
    <Carousel label="Featured" onIndexChange={onIndexChange} testID="c" {...props}>
      {slides}
    </Carousel>,
    { motion },
  );
  return { onIndexChange };
}

const current = () =>
  screen
    .getAllByRole('group', { hidden: true })
    .find((g) => g.getAttribute('aria-hidden') !== 'true')!;

describe('Carousel geometry', () => {
  it('sizes, centers and lands slides', () => {
    expect(slidePx('85%', 400)).toBe(340);
    expect(slidePx(500, 400)).toBe(400);
    expect(trackOffset(0, 340, 16, 400)).toBe(30);
    expect(trackOffset(2, 340, 16, 400)).toBe(30 - 2 * 356);
    const t = { swipeThreshold: 0.2, swipeVelocity: 500 };
    expect(landingIndex(1, -30, 0, 356, t)).toBe(1); // small drag springs back
    expect(landingIndex(1, -100, 0, 356, t)).toBe(2); // past the threshold
    expect(landingIndex(1, 100, 0, 356, t)).toBe(0);
    expect(landingIndex(1, -10, -900, 356, t)).toBe(2); // fling
  });
});

describe('Carousel (web)', () => {
  it('is a labelled carousel of labelled slides with only the current one exposed', () => {
    setup();
    const region = screen.getByRole('region', { name: 'Featured' });
    expect(region.getAttribute('aria-roledescription')).toBe('carousel');
    expect(current().getAttribute('aria-label')).toBe('Slide 1 of 4');
    expect(current().textContent).toBe('One');
  });

  it('moves with the arrows, dots and keyboard, without going past the ends', async () => {
    const { onIndexChange } = setup();
    const prev = screen.getByRole('button', { name: 'Previous slide' }) as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    expect(current().textContent).toBe('Two');
    await userEvent.click(screen.getByRole('tab', { name: 'Go to slide 4 of 4' }));
    expect(current().textContent).toBe('Four');
    expect((screen.getByRole('button', { name: 'Next slide' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowLeft' });
    expect(current().textContent).toBe('Three');
  });

  it('wraps around when looping', async () => {
    const { onIndexChange } = setup({ loop: true });
    await userEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    expect(onIndexChange).toHaveBeenLastCalledWith(3);
  });

  it('follows the parent when controlled', async () => {
    function Controlled() {
      const [i, setI] = useState(2);
      return (
        <>
          <Carousel label="Featured" index={i} onIndexChange={setI}>
            {slides}
          </Carousel>
          <span data-testid="i">{i}</span>
        </>
      );
    }
    renderThemed(<Controlled />);
    expect(current().textContent).toBe('Three');
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(screen.getByTestId('i').textContent).toBe('3');
  });

  it('autoplays with full motion and pauses on hover', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { onIndexChange } = setup({ autoPlay: 1000 }, 'full');
    await act(async () => {
      vi.advanceTimersByTime(1050);
    });
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    fireEvent.pointerEnter(screen.getByRole('region'));
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    expect(onIndexChange).toHaveBeenCalledTimes(1);
  });

  it('never autoplays with reduced motion', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { onIndexChange } = setup({ autoPlay: 500 });
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it('can hide the arrows and dots', () => {
    setup({ showArrows: false, showDots: false });
    expect(screen.queryByRole('button', { name: 'Next slide' })).toBeNull();
    expect(screen.queryByRole('tab')).toBeNull();
  });
});
