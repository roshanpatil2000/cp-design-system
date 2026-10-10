"""Render the README's "One API, all platforms" image: real screenshots inside device mockups.

Usage:
    python3 docs/showcase/mockups.py <screenshots-folder> docs/images/one-api-all-platforms.png

The folder needs:
    web-desktop.png        Storybook "Showcase / Settings" at 640x815 CSS px, 3x, e.g. with headless Chrome:
                             "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
                               --hide-scrollbars --force-device-scale-factor=3 --window-size=640,815 \
                               --virtual-time-budget=6000 --screenshot=web-desktop.png \
                               "http://localhost:6006/iframe.html?id=showcase-settings--settings&viewMode=story"
                           (640x815 keeps the web content at the same scale as the phone screens)
    ios-showcase.png       full-screen iPhone screenshot (xcrun simctl io booted screenshot)
    android-showcase.png   full-screen Android screenshot (adb exec-out screencap -p)

Everything is drawn at 2x and downscaled, which gives smooth, anti-aliased edges. Needs Pillow.
"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
S = 2  # supersampling factor

BG = (28, 28, 30)
TITLE = (245, 245, 247)
SUBTITLE = (161, 161, 166)
SCREEN_H = 1060 * S  # every screen is drawn at this height


def font(size, bold=False):
    return ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', size * S, index=1 if bold else 0)


def rounded(img, radius):
    """Clip an image to rounded corners."""
    mask = Image.new('L', img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, img.width - 1, img.height - 1), radius, fill=255)
    out = Image.new('RGBA', img.size, (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def shadow(size, radius, blur=40, alpha=150, offset=24):
    """A soft drop shadow the same shape as a device."""
    pad = blur * 3
    sh = Image.new('RGBA', (size[0] + pad * 2, size[1] + pad * 2), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle(
        (pad, pad + offset * S, pad + size[0], pad + size[1] + offset * S), radius, fill=(0, 0, 0, alpha)
    )
    return sh.filter(ImageFilter.GaussianBlur(blur * S / 2)), pad


def fit_height(img, height):
    return img.resize((round(img.width * height / img.height), height), Image.LANCZOS)


def iphone(screen):
    """iPhone with titanium rim, black bezel, Dynamic Island and side buttons."""
    screen = fit_height(screen, SCREEN_H)
    bezel, rim = 22 * S, 5 * S
    w, h = screen.width + 2 * (bezel + rim), screen.height + 2 * (bezel + rim)
    body = Image.new('RGBA', (w + 8 * S, h), (0, 0, 0, 0))  # room for side buttons
    d = ImageDraw.Draw(body)
    x0 = 4 * S
    # side buttons (drawn first so the body overlaps them)
    for y, length in ((0.17, 0.05), (0.26, 0.09), (0.37, 0.09)):
        d.rounded_rectangle((0, h * y, x0 + 6 * S, h * (y + length)), 3 * S, fill=(70, 70, 74))
    d.rounded_rectangle((w + x0 - 6 * S, h * 0.28, w + 8 * S, h * 0.42), 3 * S, fill=(70, 70, 74))
    outer_r = 92 * S
    d.rounded_rectangle((x0, 0, x0 + w - 1, h - 1), outer_r, fill=(88, 88, 92))  # titanium rim
    d.rounded_rectangle((x0 + rim, rim, x0 + w - rim - 1, h - rim - 1), outer_r - rim, fill=(10, 10, 10))
    body.alpha_composite(rounded(screen, outer_r - rim - bezel), (x0 + rim + bezel, rim + bezel))
    # Dynamic Island
    iw, ih = screen.width * 0.3, 36 * S
    cx, top = x0 + w / 2, rim + bezel + 22 * S
    d.rounded_rectangle((cx - iw / 2, top, cx + iw / 2, top + ih), ih / 2, fill=(0, 0, 0))
    return body, outer_r


def android(screen, outer_height):
    """Android phone with speaker slot and a three-button navigation bar, `outer_height` tall."""
    side, top, bottom = 18 * S, 58 * S, 92 * S
    screen = fit_height(screen, outer_height - top - bottom)
    w, h = screen.width + 2 * side, screen.height + top + bottom
    body = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(body)
    r = 54 * S
    d.rounded_rectangle((0, 0, w - 1, h - 1), r, fill=(44, 44, 46))  # edge highlight
    d.rounded_rectangle((3 * S, 3 * S, w - 3 * S - 1, h - 3 * S - 1), r - 3 * S, fill=(8, 8, 8))
    body.alpha_composite(rounded(screen, 6 * S), (side, top))
    # speaker slot
    d.rounded_rectangle((w / 2 - 50 * S, 24 * S, w / 2 + 50 * S, 32 * S), 4 * S, fill=(52, 52, 56))
    # navigation bar: back, home, recents
    cy, gray, gap = top + screen.height + bottom / 2, (150, 150, 150), screen.width / 4
    s = 13 * S
    d.polygon([(w / 2 - gap - s, cy), (w / 2 - gap + s * 0.8, cy - s), (w / 2 - gap + s * 0.8, cy + s)], fill=gray)
    d.ellipse((w / 2 - s, cy - s, w / 2 + s, cy + s), outline=gray, width=3 * S)
    d.rounded_rectangle((w / 2 + gap - s * 0.9, cy - s * 0.9, w / 2 + gap + s * 0.9, cy + s * 0.9), 2 * S, fill=gray)
    return body, r


def browser(screen, height):
    """Browser window: title bar with traffic lights, then an address bar."""
    chrome = 96 * S
    screen = fit_height(screen, height - chrome)
    w, h = screen.width, height
    r = 16 * S
    win = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(win)
    d.rounded_rectangle((0, 0, w - 1, h - 1), r, fill=(236, 236, 238))
    for i, color in enumerate(((255, 95, 87), (254, 188, 46), (40, 200, 64))):
        cx = 24 * S + i * 22 * S
        d.ellipse((cx - 7 * S, 24 * S - 7 * S, cx + 7 * S, 24 * S + 7 * S), fill=color)
    d.text((w / 2, 24 * S), 'cp-design-system', font=font(15, True), fill=(80, 80, 84), anchor='mm')
    bar = (20 * S, 48 * S, w - 20 * S, 84 * S)
    d.rounded_rectangle(bar, 10 * S, fill=(255, 255, 255))
    d.text((bar[0] + 18 * S, (bar[1] + bar[3]) / 2), 'localhost:6006', font=font(15), fill=(90, 90, 96), anchor='lm')
    # content, with only the bottom corners rounded
    content = Image.new('RGBA', (w, h - chrome), (255, 255, 255, 255))
    content.paste(screen, (0, 0))
    mask = Image.new('L', content.size, 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, -r, w - 1, content.height - 1), r, fill=255)
    win.paste(content, (0, chrome), mask)
    d.line((0, chrome, w, chrome), fill=(214, 214, 218), width=S)
    return win, r


# Screenshots, cleaned of dev-only overlays.
ios_shot = Image.open(f'{SRC}/ios-showcase.png').convert('RGB')
ImageDraw.Draw(ios_shot).rectangle((880, 150, 1206, 400), fill=(255, 255, 255))  # Expo Go dev button
android_shot = Image.open(f'{SRC}/android-showcase.png').convert('RGB')
ImageDraw.Draw(android_shot).rectangle((840, 100, 1080, 270), fill=(255, 255, 255))  # Expo Go dev button
ImageDraw.Draw(android_shot).rectangle((0, 2200, 1080, 2280), fill=(255, 255, 255))  # gesture pill
web_shot = Image.open(f'{SRC}/web-desktop.png').convert('RGB')

phone_ios, r_ios = iphone(ios_shot)
phone_android, r_android = android(android_shot, phone_ios.height)
win, r_web = browser(web_shot, phone_ios.height)

devices = [
    (win, r_web, 'Web', 'React DOM · Motion'),
    (phone_ios, r_ios, 'iOS', 'React Native · Reanimated'),
    (phone_android, r_android, 'Android', 'React Native · Reanimated'),
]
gap, margin, header, footer = 90 * S, 110 * S, 230 * S, 150 * S
tallest = max(dev.height for dev, *_ in devices)
W = sum(dev.width for dev, *_ in devices) + gap * (len(devices) - 1) + margin * 2
H = header + tallest + footer

canvas = Image.new('RGBA', (W, H), BG + (255,))
d = ImageDraw.Draw(canvas)
d.text((W / 2, 92 * S), 'One API, all platforms', font=font(64, True), fill=TITLE, anchor='mm')
d.text(
    (W / 2, 158 * S),
    'The same <TextField />, <Toggle /> and <Button /> code, rendered natively on the web, iOS and Android',
    font=font(26),
    fill=SUBTITLE,
    anchor='mm',
)

x = margin
for dev, radius, label, meta in devices:
    y = header + (tallest - dev.height)
    sh, pad = shadow(dev.size, radius)
    canvas.alpha_composite(sh, (x - pad, y - pad))
    canvas.alpha_composite(dev, (x, y))
    cx = x + dev.width / 2
    d.text((cx, header + tallest + 60 * S), label, font=font(30, True), fill=TITLE, anchor='mm')
    d.text((cx, header + tallest + 100 * S), meta, font=font(21), fill=SUBTITLE, anchor='mm')
    x += dev.width + gap

final = canvas.convert('RGB').resize((W // S, H // S), Image.LANCZOS)
final.save(OUT, optimize=True)
print(OUT, final.size)
