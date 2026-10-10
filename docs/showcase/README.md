# Showcase image

`docs/images/one-api-all-platforms.png` puts real screenshots of the same screen inside a browser window, an iPhone and an Android phone, drawn by `mockups.py`.

| Platform | Source                                        | How to capture                                                                                                           |
| -------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Web      | `apps/storybook/stories/Showcase.stories.tsx` | `yarn storybook`, then headless Chrome at 640×815, 3× (command in `mockups.py`) → `web-desktop.png`                      |
| iOS      | `apps/expo-example/Showcase.tsx`              | `yarn example`, open in the iOS Simulator, tap **Open showcase ›**, `xcrun simctl io booted screenshot ios-showcase.png` |
| Android  | same as iOS                                   | open in the Android emulator, tap **Open showcase ›**, `adb exec-out screencap -p > android-showcase.png`                |

Put the three files in one folder, then:

```bash
python3 docs/showcase/mockups.py <folder> docs/images/one-api-all-platforms.png
```

The script:

- draws the device frames: browser chrome with traffic lights and an address bar; an iPhone with a titanium rim, Dynamic Island and side buttons; an Android phone with a speaker slot and a ◀ ● ■ navigation bar
- paints over Expo Go's floating dev-tools button and Android's gesture pill, since they aren't part of the app
- keeps all three screens at the same scale
- renders at 2× and downscales for smooth edges

The paint-over areas are tuned for an iPhone 17 Pro and a Pixel 4; adjust them at the bottom of the script for other devices. It needs Pillow (`pip install pillow`).

Keep the web story and the Expo screen identical when adding components to the showcase.
