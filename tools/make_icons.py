#!/usr/bin/env python3
"""Generate the PWA app icons (terracotta rounded square + serif 'W').
Run from the repo root:  python tools/make_icons.py
Requires Pillow (pip install pillow)."""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app", "icons")
os.makedirs(OUT, exist_ok=True)

BG = (190, 100, 66, 255)       # terracotta
FG = (251, 247, 242, 255)      # warm white

FONT_CANDIDATES = [
    "C:/Windows/Fonts/georgiab.ttf",
    "C:/Windows/Fonts/georgia.ttf",
    "C:/Windows/Fonts/timesbd.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]


def load_font(size):
    for p in FONT_CANDIDATES:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def make(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    radius = int(size * 0.22)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=BG)
    font = load_font(int(size * 0.6))
    d.text((size / 2, size / 2 - size * 0.02), "W", font=font, anchor="mm", fill=FG)
    return img


for s in (192, 512):
    make(s).save(os.path.join(OUT, "icon-%d.png" % s))
    print("wrote", os.path.join("app", "icons", "icon-%d.png" % s))
