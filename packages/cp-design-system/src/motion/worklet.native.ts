import { cancelAnimation, interpolateColor, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

/*
 * Functions to call from inside worklets (animated styles, gesture callbacks).
 *
 * The native build is pre-compiled CommonJS, where a named import such as `withSpring` becomes a
 * lookup on the module object (`import_react_native_reanimated.withSpring`). A worklet that uses it
 * captures the whole module, which can't be copied to the UI thread and fails at runtime with
 * "Cannot copy value of type NativeWorklets". Binding each function to a module-level constant
 * makes worklets capture only that function.
 *
 * Worklet code must use these instead of importing from Reanimated or Worklets directly.
 * `yarn check:worklets` verifies this against the built bundle.
 */
export const springTo = withSpring;
export const stopAnimation = cancelAnimation;
export const mixColors = interpolateColor;
/** Schedules a JS-thread callback from a worklet. */
export const runOnJS = scheduleOnRN;
