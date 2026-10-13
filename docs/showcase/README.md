# Showcase image

`docs/images/one-api-all-platforms.png` puts real screenshots of the same screen inside a browser window, an iPhone and an Android phone, drawn by `mockups.py`.

| Platform | Source                                        | How to capture                                                                                                                                                               |
| -------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Web      | `apps/storybook/stories/Showcase.stories.tsx` | `yarn storybook`, then headless Chrome at 640×815, 3× (command in `mockups.py`) → `web-desktop.png`                                                                          |
| iOS      | `apps/expo-example/Showcase.tsx`              | `yarn example`, then `xcrun simctl openurl booted exp://127.0.0.1:8081/--/showcase` (opens the showcase directly), then `xcrun simctl io booted screenshot ios-showcase.png` |
| Android  | same as iOS                                   | `adb shell am start -a android.intent.action.VIEW -d exp://127.0.0.1:8081/--/showcase`, then `adb exec-out screencap -p > android-showcase.png`                              |

Put the three files in one folder, then:

```bash
python3 docs/showcase/mockups.py <folder> docs/images/one-api-all-platforms.png
```

The script:

- draws the device frames: browser chrome with traffic lights and an address bar; an iPhone with a titanium rim, Dynamic Island and side buttons; an Android phone with a speaker slot and a ◀ ● ■ navigation bar
- paints over Expo Go's floating dev-tools button and Android's gesture pill, since they aren't part of the app
- keeps all three screens at the same scale
- renders at 2× and downscales for smooth edges

The iPhone paint-over scales with the screenshot, so any iPhone works; the Android one is tuned for a Pixel 4. Adjust them at the bottom of the script for other devices. It needs Pillow (`pip install pillow`).

Keep the web story and the Expo screen identical when adding components to the showcase.

On a fresh simulator, Expo Go shows a one-time developer-menu intro over the app. Skip it with:

```bash
xcrun simctl spawn booted defaults write host.exp.Exponent EXDevMenuIsOnboardingFinished -bool YES
```
