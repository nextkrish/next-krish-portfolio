"""Build the supplied monogram as crisp, centred app icons (requires Pillow)."""
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parent.parent
source = Image.open(root / 'assets/source/nextkrish-logo-original.png').convert('RGB')
symbol = source.crop((0, 0, source.width, int(source.height * .65)))
light = symbol.convert('L')
bounds = light.point(lambda v: 255 if v > 35 else 0).getbbox()
light = light.crop(bounds)
# The silver logo is represented as white with luminance alpha, so its black
# source background cannot leave a rectangular seam on the dark favicon tile.
logo = Image.new('RGBA', light.size, (255, 255, 255, 0))
logo.putalpha(light.point(lambda v: 0 if v < 12 else v))
edge = max(logo.size)
canvas = Image.new('RGBA', (edge + 110, edge + 110), (8, 12, 16, 255))
canvas.alpha_composite(logo, ((canvas.width-logo.width)//2, (canvas.height-logo.height)//2))
canvas.resize((512, 512), Image.Resampling.LANCZOS).save(root / 'src/app/icon.png')
canvas.resize((180, 180), Image.Resampling.LANCZOS).save(root / 'src/app/apple-icon.png')
canvas.resize((64, 64), Image.Resampling.LANCZOS).save(root / 'src/app/favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)])
print('Generated aligned monogram icons from the preserved original logo.')
