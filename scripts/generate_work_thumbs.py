"""Generate 6 placeholder thumbnails (16:10) for the Works section."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "images" / "works"

W, H = 1280, 800

BG_TOP = (21, 31, 50)
BG_BOTTOM = (26, 39, 64)
BORDER = (148, 163, 184, 38)
TEXT = (241, 245, 249)
SUB = (148, 163, 184)

THEMES = [
    {
        "file": "bodymake.png",
        "title": "AI Body Make Hub",
        "sub": "AIボディメイク管理システム",
        "accent": (52, 211, 153),
        "glyph": "BM",
    },
    {
        "file": "quiz.png",
        "title": "Fit Quiz AI",
        "sub": "フィットネスクイズ AI",
        "accent": (96, 165, 250),
        "glyph": "FQ",
    },
    {
        "file": "dify-line.png",
        "title": "Coach LINE Assistant",
        "sub": "Dify × LINE チャットボット",
        "accent": (52, 211, 153),
        "glyph": "DL",
    },
    {
        "file": "meal.png",
        "title": "Tonight's Meal AI",
        "sub": "今夜のご飯何にしよう？",
        "accent": (251, 191, 36),
        "glyph": "NK",
    },
    {
        "file": "meet-minutes.png",
        "title": "Meet Minutes AI",
        "sub": "Google Meet 議事録自動生成",
        "accent": (96, 165, 250),
        "glyph": "MM",
    },
    {
        "file": "touring.png",
        "title": "Tour Planner",
        "sub": "AIドライブ・ツーリングプランナー",
        "accent": (251, 191, 36),
        "glyph": "TP",
    },
]


def vertical_gradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", size, top)
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        draw.line((0, y, w, y), fill=(r, g, b))
    return img.convert("RGBA")


def soft_glow(size, color, center, radius):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = center
    d.ellipse((cx - radius, cy - radius, cx + radius, cy + radius),
              fill=(color[0], color[1], color[2], 90))
    return layer.filter(ImageFilter.GaussianBlur(radius // 2))


def load_font(size, bold=False, jp=False):
    if jp:
        candidates = [
            "C:/Windows/Fonts/YuGothB.ttc" if bold else "C:/Windows/Fonts/YuGothR.ttc",
            "C:/Windows/Fonts/meiryob.ttc" if bold else "C:/Windows/Fonts/meiryo.ttc",
            "C:/Windows/Fonts/msgothic.ttc",
        ]
    else:
        candidates = [
            "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
            "C:/Windows/Fonts/YuGothB.ttc" if bold else "C:/Windows/Fonts/YuGothR.ttc",
            "C:/Windows/Fonts/meiryob.ttc" if bold else "C:/Windows/Fonts/meiryo.ttc",
        ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()


def render(theme):
    base = vertical_gradient((W, H), BG_TOP, BG_BOTTOM)

    base = Image.alpha_composite(
        base, soft_glow((W, H), theme["accent"], (int(W * 0.18), int(H * 0.25)), 360)
    )
    base = Image.alpha_composite(
        base, soft_glow((W, H), theme["accent"], (int(W * 0.85), int(H * 0.80)), 320)
    )

    draw = ImageDraw.Draw(base)

    pad = 24
    draw.rounded_rectangle(
        (pad, pad, W - pad, H - pad),
        radius=16,
        outline=BORDER,
        width=2,
    )

    accent = theme["accent"]
    bar_x = 80
    bar_y = 200
    draw.rounded_rectangle((bar_x, bar_y, bar_x + 8, bar_y + 280),
                           radius=4, fill=accent)

    glyph_font = load_font(160, bold=True)
    draw.text((bar_x + 40, bar_y - 30), theme["glyph"],
              font=glyph_font, fill=(accent[0], accent[1], accent[2], 230))

    title_font = load_font(64, bold=True)
    sub_font = load_font(34, jp=True)
    label_font = load_font(22, bold=True)

    draw.text((80, 520), theme["title"], font=title_font, fill=TEXT)
    draw.text((80, 600), theme["sub"], font=sub_font, fill=SUB)

    label_pad_x, label_pad_y = 18, 10
    label = "WORK"
    lw = draw.textlength(label, font=label_font)
    lh = 22
    lx, ly = 80, 80
    box = (lx, ly, lx + lw + label_pad_x * 2, ly + lh + label_pad_y * 2)
    draw.rounded_rectangle(box, radius=8, fill=(11, 18, 32, 220),
                           outline=accent, width=2)
    draw.text((lx + label_pad_x, ly + label_pad_y - 2), label,
              font=label_font, fill=accent)

    return base.convert("RGB")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for theme in THEMES:
        img = render(theme)
        out = OUT_DIR / theme["file"]
        img.save(out, "PNG", optimize=True)
        print(f"saved {out}")


if __name__ == "__main__":
    main()
