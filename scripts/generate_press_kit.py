from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "press-kit-pages"
PDF_PATH = ROOT / "docs" / "pipe-cumbe-press-kit.pdf"

W, H = 1240, 1754
M = 88

BLACK = "#050505"
SURFACE = "#111111"
SURFACE_2 = "#181818"
TEXT = "#F8F5EF"
MUTED = "#C8BFB2"
AMBER = "#F59E0B"
ORANGE = "#C2410C"
LINE = "#3A2412"

FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_ITALIC = "/System/Library/Fonts/Supplemental/Arial Italic.ttf"
FONT_IMPACT = "/System/Library/Fonts/Supplemental/Impact.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


F = {
    "eyebrow": font(FONT_BOLD, 24),
    "title": font(FONT_IMPACT, 120),
    "title_small": font(FONT_IMPACT, 82),
    "h1": font(FONT_IMPACT, 70),
    "h2": font(FONT_IMPACT, 46),
    "h3": font(FONT_BOLD, 28),
    "body": font(FONT_REG, 28),
    "body_bold": font(FONT_BOLD, 28),
    "small": font(FONT_REG, 22),
    "small_bold": font(FONT_BOLD, 22),
    "caption": font(FONT_ITALIC, 20),
}


DATA = {
    "artist": "Pipe Cumbe",
    "real_name": "Andrés Felipe Cumbe",
    "brand": "Pipe Cumbe Oficial",
    "origin": "Garzón, Huila, Colombia",
    "tagline": "Vallenato XXI · Con todos los poderes",
    "bio": (
        "Andrés Felipe Cumbe, conocido artísticamente como Pipe Cumbe, es un "
        "cantante vallenato colombiano nacido en Garzón, Huila. Su propuesta "
        "de Vallenato XXI conecta la tradición vallenata con una presencia de "
        "tarima moderna, energía en vivo y repertorio pensado para celebraciones."
    ),
    "booking": (
        "Show vallenato en vivo para ferias, fiestas, matrimonios, parrandas "
        "vallenatas, eventos privados, festivales, conciertos y eventos corporativos "
        "en Huila, Garzón, Neiva y toda Colombia."
    ),
    "phone": "+57 314 265 3942",
    "web": "pipecumbeoficial.com",
    "instagram": "@pipecumbe",
    "youtube": "@VALLENATOXXI",
    "videos": [
        "La Fuga",
        "Quiero Que Seas Mi Estrella (Live)",
        "Parranda, Ron y Mujer (Live)",
    ],
    "events": [
        "Ferias y fiestas",
        "Eventos privados",
        "Conciertos",
        "Festivales",
        "Eventos corporativos",
        "Matrimonios",
        "Parrandas vallenatas",
        "Fiestas patronales",
    ],
    "cities": [
        "Garzón",
        "Neiva",
        "Huila",
        "Bogotá",
        "Medellín",
        "Cali",
        "Villavicencio",
        "Toda Colombia",
    ],
    "rider": [
        "Fecha, ciudad y lugar confirmados antes de cotizar.",
        "Definir duración del show, formato y horario de presentación.",
        "Confirmar sonido, tarima, camerino, transporte y hospedaje si aplica.",
        "Separación de fecha con anticipo y acuerdo por escrito.",
    ],
}


def asset(path):
    return ROOT / path


def cover_crop(path, size, focus=(0.55, 0.35)):
    img = Image.open(path).convert("RGB")
    iw, ih = img.size
    tw, th = size
    scale = max(tw / iw, th / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    img = img.resize((nw, nh), Image.LANCZOS)
    left = int((nw - tw) * focus[0])
    top = int((nh - th) * focus[1])
    return img.crop((left, top, left + tw, top + th))


def gradient(size, top=(5, 5, 5, 245), bottom=(5, 5, 5, 90)):
    w, h = size
    img = Image.new("RGBA", size)
    pix = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        c = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(4))
        for x in range(w):
            pix[x, y] = c
    return img


def blank():
    return Image.new("RGB", (W, H), BLACK)


def draw_header(draw, title, eyebrow=None):
    if eyebrow:
        draw.text((M, 72), eyebrow.upper(), font=F["eyebrow"], fill=AMBER)
    draw.text((M, 112), title, font=F["h1"], fill=TEXT)
    draw.line((M, 200, W - M, 200), fill=LINE, width=3)


def line_height(fnt, extra=10):
    bbox = fnt.getbbox("Ag")
    return bbox[3] - bbox[1] + extra


def wrapped_text(draw, text, xy, width, fnt, fill=MUTED, spacing=8):
    x, y = xy
    avg = max(draw.textlength("abcdefghijklmnopqrstuvwxyz", font=fnt) / 26, 1)
    chars = max(int(width / avg), 12)
    lines = []
    for paragraph in text.split("\n"):
        lines.extend(wrap(paragraph, chars) or [""])
    lh = line_height(fnt, spacing)
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += lh
    return y


def pill(draw, xy, text, fill=SURFACE_2, outline=LINE):
    x, y = xy
    pad_x, pad_y = 22, 12
    box = draw.textbbox((0, 0), text, font=F["small_bold"])
    w = box[2] - box[0] + pad_x * 2
    h = box[3] - box[1] + pad_y * 2
    draw.rounded_rectangle((x, y, x + w, y + h), radius=24, fill=fill, outline=outline, width=2)
    draw.text((x + pad_x, y + pad_y - 2), text, font=F["small_bold"], fill=TEXT)
    return x + w + 12, y


def card(draw, box, title, body=None):
    x1, y1, x2, y2 = box
    draw.rounded_rectangle(box, radius=28, fill=SURFACE, outline=LINE, width=2)
    draw.text((x1 + 30, y1 + 28), title, font=F["h3"], fill=TEXT)
    if body:
        wrapped_text(draw, body, (x1 + 30, y1 + 76), x2 - x1 - 60, F["small"], fill=MUTED, spacing=7)


def place_image(page, path, box, focus=(0.5, 0.5)):
    x1, y1, x2, y2 = box
    img = cover_crop(path, (x2 - x1, y2 - y1), focus)
    mask = Image.new("L", img.size, 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.rounded_rectangle((0, 0, img.size[0], img.size[1]), radius=34, fill=255)
    page.paste(img, (x1, y1), mask)


def page_cover():
    page = cover_crop(asset("public/hero/pipe-stage.webp"), (W, H), (0.58, 0.32))
    page = ImageOps.autocontrast(page)
    page = Image.blend(page, Image.new("RGB", (W, H), BLACK), 0.24)
    page.paste(gradient((W, H), (5, 5, 5, 245), (5, 5, 5, 40)), (0, 0), gradient((W, H), (5, 5, 5, 245), (5, 5, 5, 40)))
    draw = ImageDraw.Draw(page)
    draw.text((M, 132), "PRESS KIT / MEDIA KIT", font=F["eyebrow"], fill=AMBER)
    draw.text((M, 206), "PIPE", font=F["title"], fill=TEXT)
    draw.text((M, 326), "CUMBE", font=F["title"], fill=TEXT)
    draw.text((M, 474), DATA["tagline"].upper(), font=F["h3"], fill=AMBER)
    wrapped_text(draw, DATA["booking"], (M, 1110), 760, F["body"], fill=TEXT, spacing=10)
    draw.rounded_rectangle((M, 1440, W - M, 1606), radius=30, fill=(5, 5, 5), outline=LINE, width=2)
    draw.text((M + 34, 1476), f"Booking: {DATA['phone']}", font=F["body_bold"], fill=TEXT)
    draw.text((M + 34, 1528), f"{DATA['web']} · Instagram {DATA['instagram']} · YouTube {DATA['youtube']}", font=F["small"], fill=MUTED)
    return page


def page_bio():
    page = blank()
    draw = ImageDraw.Draw(page)
    draw_header(draw, "Identidad artistica", "Pipe Cumbe Oficial")
    place_image(page, asset("public/gallery/g2.webp"), (M, 270, 504, 878), (0.5, 0.18))
    draw.text((548, 284), "Bio oficial", font=F["h2"], fill=TEXT)
    y = wrapped_text(draw, DATA["bio"], (548, 350), 590, F["body"], fill=MUTED, spacing=10)
    y = wrapped_text(draw, DATA["booking"], (548, y + 34), 590, F["body"], fill=MUTED, spacing=10)

    facts = [
        ("Nombre artistico", DATA["artist"]),
        ("Nombre real", DATA["real_name"]),
        ("Origen", DATA["origin"]),
        ("Género", "Vallenato, música colombiana"),
        ("Concepto", "Vallenato XXI"),
        ("Cobertura", "Huila, Garzón, Neiva y Colombia"),
    ]
    y0 = 960
    draw.text((M, y0), "Datos rapidos", font=F["h2"], fill=TEXT)
    y = y0 + 78
    for i, (k, v) in enumerate(facts):
        col = i % 2
        row = i // 2
        x = M + col * 532
        yy = y + row * 150
        card(draw, (x, yy, x + 500, yy + 116), k, v)
    return page


def page_show():
    page = blank()
    draw = ImageDraw.Draw(page)
    draw_header(draw, "Show y formatos", "Contrataciones")
    draw.text((M, 270), "Eventos ideales", font=F["h2"], fill=TEXT)
    x, y = M, 346
    for item in DATA["events"]:
        nx, _ = pill(draw, (x, y), item)
        if nx > W - M - 260:
            x = M
            y += 70
        else:
            x = nx

    draw.text((M, 604), "Cobertura", font=F["h2"], fill=TEXT)
    x, y = M, 680
    for item in DATA["cities"]:
        nx, _ = pill(draw, (x, y), item)
        if nx > W - M - 210:
            x = M
            y += 70
        else:
            x = nx

    place_image(page, asset("public/gallery/g1.webp"), (M, 900, 582, 1514), (0.48, 0.4))
    place_image(page, asset("public/gallery/g3.webp"), (632, 900, W - M, 1514), (0.55, 0.16))
    draw.text((M, 1580), "Videos destacados", font=F["h2"], fill=TEXT)
    yy = 1640
    for video in DATA["videos"]:
        draw.text((M + 22, yy), f"- {video}", font=F["small_bold"], fill=MUTED)
        yy += 34
    return page


def page_booking():
    page = blank()
    draw = ImageDraw.Draw(page)
    draw_header(draw, "Booking y rider básico", "Contacto")
    card(
        draw,
        (M, 276, W - M, 520),
        "Contacto oficial",
        f"Booking: {DATA['phone']}\nWeb oficial: {DATA['web']}\nInstagram: {DATA['instagram']}\nYouTube: {DATA['youtube']}",
    )
    draw.text((M, 604), "Información necesaria para cotizar", font=F["h2"], fill=TEXT)
    y = 690
    checklist = [
        "Ciudad y lugar del evento",
        "Fecha y horario",
        "Tipo de evento",
        "Número aproximado de asistentes",
        "Duración esperada del show",
        "Condiciones de sonido, tarima y logística",
    ]
    for item in checklist:
        draw.rounded_rectangle((M, y, W - M, y + 58), radius=18, fill=SURFACE, outline=LINE, width=1)
        draw.text((M + 26, y + 16), item, font=F["small_bold"], fill=TEXT)
        y += 76

    draw.text((M, 1198), "Rider técnico básico", font=F["h2"], fill=TEXT)
    y = 1270
    for item in DATA["rider"]:
        y = wrapped_text(draw, f"- {item}", (M + 10, y), W - M * 2 - 20, F["small"], fill=MUTED, spacing=7) + 8

    draw.rounded_rectangle((M, 1530, W - M, 1640), radius=30, fill=ORANGE, outline=AMBER, width=2)
    draw.text((M + 34, 1562), "Para separar fecha: confirmar disponibilidad y anticipo por escrito.", font=F["body_bold"], fill=TEXT)
    draw.text((M, 1690), "Documento de referencia para medios, empresas, agencias, alcaldías y organizadores.", font=F["caption"], fill="#8E8173")
    return page


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pages = [page_cover(), page_bio(), page_show(), page_booking()]
    pngs = []
    for i, page in enumerate(pages, 1):
        path = OUT_DIR / f"page-{i:02d}.png"
        page.save(path, "PNG")
        pngs.append(path)

    rgb_pages = [Image.open(path).convert("RGB") for path in pngs]
    rgb_pages[0].save(
        PDF_PATH,
        "PDF",
        save_all=True,
        append_images=rgb_pages[1:],
        resolution=150,
        quality=95,
    )
    print(PDF_PATH)
    for path in pngs:
        print(path)


if __name__ == "__main__":
    main()
