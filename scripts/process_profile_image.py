"""
Profile photo processor (optional).

NOTE: User requested unprocessed/raw image for the site.
Use profile.png / profile-source.png directly — do not run this script
unless stylization is needed again.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(
    r"C:\Users\User\.cursor\projects\c-Users-User-AI-8-5\assets"
    r"\c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"7a0ca68a5068b616ee681ac023f00f35_images_image-6e85f017-"
    r"609b-46aa-93f2-1121282ef3de.png"
)
OUT_DIR = ROOT / "images"


def remove_white_bg(img: Image.Image, threshold: int = 238) -> Image.Image:
    img = img.convert("RGBA")
    data = np.array(img)
    r, g, b, a = data.T
    white = (r > threshold) & (g > threshold) & (b > threshold)
    data[..., 3][white.T] = 0
    return Image.fromarray(data)


def soft_gradient_bg(size: tuple[int, int]) -> Image.Image:
    w, h = size
    bg = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(bg)
    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(26 + (38 - 26) * t)
        g = int(32 + (42 - 32) * t)
        b = int(58 + (72 - 58) * t)
        draw.line((0, y, w, y), fill=(r, g, b, 255))
    # soft top glow
    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse((-w // 4, -h // 3, w + w // 4, h // 2), fill=(80, 60, 100, 45))
    return Image.alpha_composite(bg, glow)


def blend_smooth(img: Image.Image, passes: int = 2) -> Image.Image:
    smooth = img
    for _ in range(passes):
        smooth = smooth.filter(ImageFilter.SMOOTH_MORE)
    return Image.blend(img, smooth, alpha=0.72)


def cel_shade(img: Image.Image, bits: int = 4) -> Image.Image:
    img = blend_smooth(img, passes=3)
    return ImageOps.posterize(img.convert("RGB"), bits)


def anime_color_grade(img: Image.Image) -> Image.Image:
    img = ImageEnhance.Color(img).enhance(1.12)
    img = ImageEnhance.Contrast(img).enhance(0.95)
    img = ImageEnhance.Brightness(img).enhance(1.06)
    # slight cool-warm mix via channel tweak
    arr = np.array(img, dtype=np.float32)
    arr[..., 0] *= 0.96
    arr[..., 2] *= 1.04
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def soft_anime_outline(base: Image.Image, line_rgb=(70, 78, 108), alpha: int = 55) -> Image.Image:
    edges = base.convert("RGB").filter(ImageFilter.FIND_EDGES)
    edges = ImageOps.grayscale(edges).filter(ImageFilter.GaussianBlur(2.0))
    edges = ImageOps.autocontrast(edges, cutoff=3)
    tinted = ImageOps.colorize(edges, black=(0, 0, 0), white=line_rgb)
    layer = tinted.convert("RGBA")
    layer.putalpha(alpha)
    return Image.alpha_composite(base.convert("RGBA"), layer)


def soft_bloom(img: Image.Image, strength: float = 0.22) -> Image.Image:
    glow = img.convert("RGB").filter(ImageFilter.GaussianBlur(8))
    return Image.blend(img.convert("RGB"), glow, alpha=strength)


def blur_region(img: Image.Image, box: tuple[int, int, int, int], radius: int = 10) -> Image.Image:
    x0, y0, x1, y1 = box
    region = img.crop(box).filter(ImageFilter.GaussianBlur(radius))
    img.paste(region, box)
    return img


def draw_anime_hair_cover(
    img: Image.Image,
    cx: int,
    cy: int,
    head_w: int,
    head_h: int,
) -> Image.Image:
    """Soft bangs + face shadow (feathered) — illustration-style anonymity."""
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)

    draw.ellipse(
        (cx - head_w // 2, cy - int(head_h * 1.1), cx + head_w // 2, cy + head_h // 2),
        fill=220,
    )
    for dx in (-0.28, -0.08, 0.12, 0.30):
        bx = cx + int(head_w * dx)
        draw.ellipse(
            (bx - head_w // 5, cy - head_h // 2, bx + head_w // 5, cy + head_h // 4),
            fill=200,
        )
    draw.ellipse(
        (cx - head_w // 3, cy - head_h // 5, cx + head_w // 3, cy + head_h // 3),
        fill=180,
    )
    mask = mask.filter(ImageFilter.GaussianBlur(16))

    # warm anime hair shadow (not solid black)
    tint = Image.new("RGBA", (w, h), (62, 52, 78, 0))
    tint.putalpha(mask)
    result = Image.alpha_composite(img.convert("RGBA"), tint)

    shine = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shine)
    sdraw.arc(
        (cx - head_w // 3, cy - head_h, cx + head_w // 4, cy - head_h // 6),
        start=210,
        end=330,
        fill=(140, 130, 165, 50),
        width=4,
    )
    return Image.alpha_composite(result, shine)


def make_circular(img: Image.Image, size: int = 520) -> Image.Image:
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size, size), fill=255)
    bg = soft_gradient_bg((size, size))
    result = bg.copy()
    result.paste(img, (0, 0), mask)
    # soft ring
    ring = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    rdraw = ImageDraw.Draw(ring)
    rdraw.ellipse((4, 4, size - 4, size - 4), outline=(150, 145, 175, 50), width=2)
    return Image.alpha_composite(result, ring)


def process() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    src = Image.open(SRC).convert("RGBA")
    src = remove_white_bg(src)
    bbox = src.getbbox()
    if bbox:
        src = src.crop(bbox)

    max_h = 900
    if src.height > max_h:
        r = max_h / src.height
        src = src.resize((int(src.width * r), max_h), Image.Resampling.LANCZOS)

    w, h = src.size
    alpha = src.split()[3]

    # Anime pipeline on RGB
    rgb = src.convert("RGB")
    rgb = blend_smooth(rgb, passes=2)
    rgb = cel_shade(rgb, bits=5)
    rgb = anime_color_grade(rgb)
    rgb = soft_bloom(rgb, strength=0.12)

    comp = rgb.convert("RGBA")
    comp.putalpha(alpha)

    # Face: soft blur then illustration hair cover (front-facing full body)
    face_cy = int(h * 0.075)
    face_cx = w // 2
    face_w, face_h = int(w * 0.30), int(h * 0.11)
    face_box = (
        face_cx - face_w // 2,
        max(0, face_cy - face_h // 2),
        face_cx + face_w // 2,
        face_cy + face_h // 2,
    )
    comp_rgb = comp.convert("RGB")
    comp_rgb = blur_region(comp_rgb, face_box, radius=14)
    comp = comp_rgb.convert("RGBA")
    comp.putalpha(alpha)

    head_w, head_h = int(w * 0.34), int(h * 0.14)
    comp = draw_anime_hair_cover(comp, face_cx, face_cy, head_w, head_h)
    # very light line — optional; skip if too "digital"
    comp = soft_anime_outline(comp, line_rgb=(90, 95, 120), alpha=35)

    # Composite on soft gradient (full body)
    bg = soft_gradient_bg((w, h))
    final = Image.alpha_composite(bg, comp)

    hero_path = OUT_DIR / "profile-ai.png"
    final.save(hero_path, "PNG", optimize=True)

    circ_path = OUT_DIR / "profile-ai-circle.png"
    make_circular(final, 520).save(circ_path, "PNG", optimize=True)

    banner = final.crop((0, 0, w, int(h * 0.72)))
    banner_path = OUT_DIR / "profile-ai-banner.png"
    banner.save(banner_path, "PNG", optimize=True)

    print(f"Saved (soft anime style):\n  {hero_path}\n  {circ_path}\n  {banner_path}")


if __name__ == "__main__":
    process()
