"""LearnSphere Academy — course thumbnail utility.

Usage
-----
  python make-thumbnails.py
      Generates tone-matched placeholder thumbnails for every course that
      does not have an image yet (800x450 WebP), and wires the `image:`
      field into js/data.js if missing.

  python make-thumbnails.py <folder>
      Converts your own images into course thumbnails. Each file must map
      to a course slug (exact name or a prefix of it), e.g.
          web-development.jpg   -> course "web-development"
          python.png            -> course "python-programming"
      Accepted formats: png, jpg/jpeg, webp, avif, bmp, gif, tiff.
      Images are centre-cropped to 16:9 and exported as 800x450 WebP (~q82)
      into assets/images/course-<slug>.webp. Unmatched files are reported.

  python make-thumbnails.py <folder> --dry-run
      Shows what would be converted without writing anything.

All output dimensions/filenames are stable, so re-running the script
after replacing an image simply overwrites the previous WebP — no code
changes needed.
"""

import os
import re
import sys

try:
    from PIL import Image, ImageDraw
except ImportError:
    sys.exit("Pillow is required:  python -m pip install Pillow")

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_JS = os.path.join(ROOT, "js", "data.js")
VARS_CSS = os.path.join(ROOT, "css", "variables.css")
OUT_DIR = os.path.join(ROOT, "assets", "images")
SIZE = (800, 450)
WEBP_ARGS = {"quality": 82, "method": 6}
ACCEPTED = (".png", ".jpg", ".jpeg", ".webp", ".avif", ".bmp", ".gif", ".tif", ".tiff")


# ---------- read course list (slug + tone) from js/data.js ----------
def read_courses():
    with open(DATA_JS, encoding="utf-8") as fh:
        lines = fh.read().splitlines()
    slug_re = re.compile(r'^\s*slug:\s*"([a-z0-9-]+)",\s*$')
    tone_re = re.compile(r'^\s*tone:\s*"([a-z-]+)",\s*$')
    courses = []
    current = None
    for line in lines:
        m = slug_re.match(line)
        if m:
            current = {"slug": m.group(1), "tone": None, "has_image": False, "line": line}
            courses.append(current)
            continue
        if current is not None:
            if tone_re.match(line) and current["tone"] is None:
                current["tone"] = tone_re.match(line).group(1)
            if re.match(r'^\s*image:\s*"', line):
                current["has_image"] = True
    return courses, lines


def read_tone_palette():
    """Light-theme tone colours from css/variables.css (first definition wins)."""
    palette = {}
    with open(VARS_CSS, encoding="utf-8") as fh:
        text = fh.read()
    for key, value in re.findall(r"(--tone-[a-z]+-[ab]|--tone-[a-z]+-ink):\s*(#[0-9a-fA-F]{6})", text):
        palette.setdefault(key, value)
    return palette


def hex_to_rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


# ---------- placeholder artwork ----------
def make_placeholder(tone, palette):
    a = hex_to_rgb(palette["--tone-%s-a" % tone])
    b = hex_to_rgb(palette["--tone-%s-b" % tone])
    ink = hex_to_rgb(palette.get("--tone-%s-ink" % tone, "#ffffff"))

    w, h = SIZE
    img = Image.new("RGB", SIZE)
    px = img.load()
    span = w + h - 2
    for y in range(h):
        for x in range(w):
            t = (x + y) / span
            px[x, y] = tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

    overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Decorative ring, lower right (echoes .media::before)
    draw.ellipse((w * 0.52, h * 0.28, w * 1.28, h * 1.62), outline=ink + (46,), width=2)
    # Soft filled disc, upper right (echoes .media::after)
    disc = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    ImageDraw.Draw(disc).ellipse((w * 0.62, -h * 0.18, w * 0.96, h * 0.42), fill=ink + (16,))
    overlay = Image.alpha_composite(overlay, disc)

    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


# ---------- user image conversion ----------
def find_user_image(folder, slug):
    """Match a provided file to a slug by exact or prefix name."""
    exact, prefix = None, None
    for name in sorted(os.listdir(folder)):
        base, ext = os.path.splitext(name)
        if ext.lower() not in ACCEPTED:
            continue
        base = base.lower().replace("_", "-").replace(" ", "-")
        if base == slug:
            exact = name
        elif slug.startswith(base) and len(base) >= 4:
            prefix = prefix or name
    return exact or prefix


def convert(source):
    img = Image.open(source)
    img = ImageOps_exif(img)
    img = img.convert("RGB")
    # Centre-crop to 16:9, then resize.
    w, h = img.size
    target = SIZE[0] / SIZE[1]
    if w / h > target:  # too wide -> crop sides
        new_w = int(h * target)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    else:  # too tall -> crop top/bottom
        new_h = int(w / target)
        top = (h - new_h) // 2
        img = img.crop((0, top, w, top + new_h))
    return img.resize(SIZE, Image.LANCZOS)


def ImageOps_exif(img):
    try:
        from PIL import ImageOps

        return ImageOps.exif_transpose(img)
    except Exception:
        return img


# ---------- data.js wiring ----------
def wire_data_js(courses, lines, dry):
    changed = False
    insertions = []  # (index_after_which, text)
    slug_line_idx = {}
    for idx, line in enumerate(lines):
        m = re.match(r'^(\s*)slug:\s*"([a-z0-9-]+)",\s*$', line)
        if m:
            slug_line_idx[idx] = (m.group(1), m.group(2))
    slug_indices = sorted(slug_line_idx)
    for pos, idx in enumerate(slug_indices):
        indent, slug = slug_line_idx[idx]
        end = slug_indices[pos + 1] if pos + 1 < len(slug_indices) else len(lines)
        block_has_image = any(re.match(r'^\s*image:\s*"', ln) for ln in lines[idx + 1 : end])
        if block_has_image:
            continue
        insertions.append((idx, '%simage: "course-%s.webp",' % (indent, slug)))
        changed = True
    if changed and not dry:
        for idx, text in sorted(insertions, key=lambda p: -p[0]):
            lines.insert(idx + 1, text)
        with open(DATA_JS, "w", encoding="utf-8", newline="\n") as fh:
            fh.write("\n".join(lines) + "\n")
    return changed, len(insertions)


# ---------- main ----------
def main():
    args = [a for a in sys.argv[1:]]
    dry = "--dry-run" in args
    args = [a for a in args if a != "--dry-run"]
    folder = args[0] if args else None
    if folder and not os.path.isdir(folder):
        sys.exit("Not a folder: %s" % folder)

    courses, lines = read_courses()
    if len(courses) != 12:
        sys.exit("Expected 12 courses in js/data.js, found %d — aborting." % len(courses))
    palette = read_tone_palette()
    missing_tone = [c["slug"] for c in courses if ("--tone-%s-a" % c["tone"]) not in palette]
    if missing_tone:
        sys.exit("Could not resolve tones for: %s" % ", ".join(missing_tone))

    changed, count = wire_data_js(courses, lines, dry)
    print("js/data.js: %s (%d course(s) wired)" % (
        "updated" if changed and not dry else ("would update" if changed else "already wired"), count))

    report = []
    unmatched = []
    for course in courses:
        slug = course["slug"]
        out_path = os.path.join(OUT_DIR, "course-%s.webp" % slug)
        source = None
        if folder:
            source = find_user_image(folder, slug)
            if not source:
                unmatched.append(slug)
        if source:
            img = convert(os.path.join(folder, source))
            action = "converted %s" % source
        elif os.path.exists(out_path):
            report.append((slug, "kept existing", os.path.getsize(out_path)))
            continue
        else:
            img = make_placeholder(course["tone"], palette)
            action = "placeholder (%s tone)" % course["tone"]
        if not dry:
            os.makedirs(OUT_DIR, exist_ok=True)
            img.save(out_path, "WEBP", **WEBP_ARGS)
        report.append((slug, action, os.path.getsize(out_path) if not dry else 0))

    print("\n%-24s %-28s %s" % ("course", "action", "size"))
    for slug, action, size in report:
        print("%-24s %-28s %5.1f KB" % (slug, action, size / 1024))
    if unmatched:
        print("\nNo image matched in %s for: %s (placeholders kept)" % (folder, ", ".join(unmatched)))
    if dry:
        print("\nDry run — nothing was written.")
    else:
        print("\nDone. Thumbnails: assets/images/course-<slug>.webp (800x450 WebP).")


if __name__ == "__main__":
    main()
