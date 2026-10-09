# Showcase image

`docs/images/one-api-all-platforms.png` is made from three screenshots of the same screen:

| Platform | Source                                        | How to capture                                                                                                           |
| -------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Web      | `apps/storybook/stories/Showcase.stories.tsx` | `yarn storybook`, open **Showcase → Settings** at a 402×874 viewport, screenshot                                         |
| iOS      | `apps/expo-example/Showcase.tsx`              | `yarn example`, open in the iOS Simulator, tap **Open showcase ›**, `xcrun simctl io booted screenshot ios-showcase.png` |
| Android  | same as iOS                                   | open in the Android emulator, tap **Open showcase ›**, `adb exec-out screencap -p > android-showcase.png`                |

Put the three files (`web-showcase.png`, `ios-showcase.png`, `android-showcase.png`) in one folder, then:

```bash
python3 docs/showcase/compose.py <folder> docs/images/one-api-all-platforms.png
```

The script crops each screenshot to the app content, paints over Expo Go's floating dev-tools button (it's not part of the app), and lays the three out side by side. The crop offsets are tuned for an iPhone 17 Pro and a Pixel 4; adjust `top`, `cover` and `bottom_cut` in `panels` for other devices. It needs Pillow (`pip install pillow`).

Keep the web story and the Expo screen identical when adding components to the showcase.
