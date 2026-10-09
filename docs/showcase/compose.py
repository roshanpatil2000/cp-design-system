"""Compose the README 'One API, all platforms' image from three showcase screenshots."""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SP = sys.argv[1]
OUT = sys.argv[2]

PANEL_W = 460          # each screenshot is scaled to this width
GAP = 36
MARGIN = 48
RADIUS = 28
BG = (244, 245, 247)
TEXT = (41, 42, 46)
SUBTLE = (80, 82, 88)


def font(size, weight=400):
    # Helvetica Neue: face 0 is Regular, 1 is Bold.
    return ImageFont.truetype('/System/Library/Fonts/HelveticaNeue.ttc', size, index=1 if weight >= 600 else 0)


def trim_bottom(img, threshold=250):
    """Drop trailing near-white rows, keeping a little padding."""
    gray = img.convert('L')
    w, h = gray.size
    px = gray.load()
    last = 0
    for y in range(h):
        if any(px[x, y] < threshold for x in range(0, w, 3)):
            last = y
    return img.crop((0, 0, w, min(h, last + int(0.06 * w))))


def load(name, top, cover=None, bottom_cut=0):
    img = Image.open(f'{SP}/{name}').convert('RGB')
    if cover:  # paint over Expo Go's floating dev-tools button (not part of the app)
        ImageDraw.Draw(img).rectangle(cover, fill=(255, 255, 255))
    # bottom_cut drops system chrome such as the Android navigation handle.
    img = img.crop((0, top, img.width, img.height - bottom_cut))
    img = trim_bottom(img)
    scale = PANEL_W / img.width
    return img.resize((PANEL_W, round(img.height * scale)), Image.LANCZOS)


panels = [
    ('Web', 'React DOM · Motion', load('web-showcase.png', top=16)),
    ('iOS', 'React Native · Reanimated', load('ios-showcase.png', top=312, cover=(880, 100, 1206, 400), bottom_cut=200)),
    ('Android', 'React Native · Reanimated', load('android-showcase.png', top=192, cover=(840, 80, 1080, 270), bottom_cut=200)),
]
panel_h = max(p[2].height for p in panels)

title_f, sub_f, label_f, meta_f = font(46, 700), font(22, 400), font(26, 700), font(18, 400)
header_h = 150
label_h = 70
W = MARGIN * 2 + PANEL_W * 3 + GAP * 2
H = header_h + panel_h + label_h + MARGIN

canvas = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(canvas)
d.text((W / 2, 52), 'One API, all platforms', font=title_f, fill=TEXT, anchor='mm')
d.text(
    (W / 2, 102),
    'The same <Toggle /> and <Button /> code, rendered natively on the web, iOS and Android',
    font=sub_f,
    fill=SUBTLE,
    anchor='mm',
)

for i, (label, meta, img) in enumerate(panels):
    x = MARGIN + i * (PANEL_W + GAP)
    y = header_h
    # soft shadow
    shadow = Image.new('L', (PANEL_W + 40, panel_h + 40), 0)
    ImageDraw.Draw(shadow).rounded_rectangle((20, 24, PANEL_W + 20, panel_h + 20), RADIUS, fill=60)
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    canvas.paste((210, 212, 218), (x - 20, y - 20), shadow)
    # white card with the screenshot, rounded
    card = Image.new('RGB', (PANEL_W, panel_h), (255, 255, 255))
    card.paste(img, (0, 0))
    mask = Image.new('L', (PANEL_W, panel_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, PANEL_W - 1, panel_h - 1), RADIUS, fill=255)
    canvas.paste(card, (x, y), mask)
    d.rounded_rectangle((x, y, x + PANEL_W - 1, y + panel_h - 1), RADIUS, outline=(225, 227, 232), width=2)
    # label
    d.text((x + PANEL_W / 2, y + panel_h + 30), label, font=label_f, fill=TEXT, anchor='mm')
    d.text((x + PANEL_W / 2, y + panel_h + 58), meta, font=meta_f, fill=SUBTLE, anchor='mm')

canvas.save(OUT, optimize=True)
print(OUT, canvas.size)
