import { describe, expect, it, jest } from '@jest/globals';
import { Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';
import { Carousel, ThemeProvider, type CarouselProps } from '../../index.native';

async function setup(props: Partial<CarouselProps> = {}) {
  const onIndexChange = jest.fn();
  await render(
    <ThemeProvider motion="reduced">
      <Carousel label="Featured" onIndexChange={onIndexChange} testID="c" {...props}>
        {['One', 'Two', 'Three'].map((t) => (
          <Text key={t}>{t}</Text>
        ))}
      </Carousel>
    </ThemeProvider>,
  );
  await act(async () => {
    fireEvent(screen.getByTestId('c'), 'layout', {
      nativeEvent: { layout: { width: 400, height: 200, x: 0, y: 0 } },
    });
  });
  return { onIndexChange };
}

describe('Carousel (native)', () => {
  it('renders labelled slides once it knows its width', async () => {
    await setup({ slideWidth: '85%' });
    expect(screen.getByTestId('c-slide-0').props.accessibilityLabel).toBe('Slide 1 of 3');
    expect(
      screen.getByTestId('c-slide-1', { includeHiddenElements: true }).props.style,
    ).toBeTruthy();
    expect(screen.getByText('One')).toBeTruthy();
  });

  it('jumps to a slide from the dots and reports the index', async () => {
    const { onIndexChange } = await setup();
    await fireEvent.press(screen.getByRole('tab', { name: 'Go to slide 3 of 3' }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  const swipe = async (translationX: number, velocityX = 0) => {
    fireGestureHandler(getByGestureTestId('c-pan'), [
      { state: State.BEGAN, translationX: 0 },
      { state: State.ACTIVE, translationX: translationX / 2 },
      { state: State.ACTIVE, translationX, velocityX },
      { state: State.END, translationX, velocityX },
    ]);
    await act(async () => {});
  };

  it('swipes to the next slide past the threshold, and springs back below it', async () => {
    const { onIndexChange } = await setup({ slideWidth: 300, space: '0' });
    await swipe(-30);
    expect(onIndexChange).not.toHaveBeenCalled();
    await swipe(-120);
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
  });

  it('changes slide on a quick flick and stops at the first slide', async () => {
    const { onIndexChange } = await setup({ slideWidth: 300, space: '0' });
    await swipe(40, 900);
    expect(onIndexChange).not.toHaveBeenCalled();
    await swipe(-20, -900);
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
  });

  it('shows arrows on request and respects the ends', async () => {
    const { onIndexChange } = await setup({ showArrows: true });
    expect(
      screen.getByRole('button', { name: 'Previous slide' }).props.accessibilityState.disabled,
    ).toBe(true);
    await fireEvent.press(screen.getByRole('button', { name: 'Next slide' }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });
});
