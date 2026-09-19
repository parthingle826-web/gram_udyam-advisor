
import os
import shutil
import base64
import io
from PIL import Image

src_path = r"C:\Users\Parth Ingle\Documents\Logo_gram.jpeg"
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
public_dir = os.path.join(root_dir, "public")
app_dir = os.path.join(root_dir, "src", "app")

os.makedirs(public_dir, exist_ok=True)

# 1. Copy full resolution logo.jpeg
dest_logo = os.path.join(public_dir, "logo.jpeg")
shutil.copy2(src_path, dest_logo)
print("Copied to", dest_logo)

# Load image
img = Image.open(src_path)

# 2. Navbar optimized logo (96x96 PNG)
nav_img = img.resize((96, 96), Image.Resampling.LANCZOS)
nav_path = os.path.join(public_dir, "logo-navbar.png")
nav_img.save(nav_path, format="PNG")
print("Saved", nav_path)

# 3. Favicon (16, 32, 48)
ico_path_public = os.path.join(public_dir, "favicon.ico")
ico_path_app = os.path.join(app_dir, "favicon.ico")
img_rgba = img.convert("RGBA")
img_rgba.save(ico_path_public, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
shutil.copy2(ico_path_public, ico_path_app)
print("Saved", ico_path_public, "and", ico_path_app)

# 4. Apple Touch Icon (180x180)
apple_path = os.path.join(public_dir, "apple-touch-icon.png")
apple_img = img.resize((180, 180), Image.Resampling.LANCZOS)
apple_img.save(apple_path, format="PNG")
print("Saved", apple_path)

# 5. PWA Icons (192x192, 512x512)
pwa_192 = os.path.join(public_dir, "icon-192.png")
img.resize((192, 192), Image.Resampling.LANCZOS).save(pwa_192, format="PNG")
pwa_512 = os.path.join(public_dir, "icon-512.png")
img.resize((512, 512), Image.Resampling.LANCZOS).save(pwa_512, format="PNG")
print("Saved", pwa_192, "and", pwa_512)

# 6. Open Graph image (1200x630 with logo centered on clean white canvas)
og_canvas = Image.new("RGB", (1200, 630), (255, 255, 255))
og_logo = img.resize((480, 480), Image.Resampling.LANCZOS)
og_canvas.paste(og_logo, ((1200 - 480) // 2, (630 - 480) // 2))
og_path = os.path.join(public_dir, "og-image.jpeg")
og_canvas.save(og_path, format="JPEG", quality=95)
print("Saved", og_path)

# 7. Base64 representation for PDF
pdf_logo = img.resize((160, 160), Image.Resampling.LANCZOS)
buf = io.BytesIO()
pdf_logo.save(buf, format="JPEG", quality=90)
b64_str = base64.b64encode(buf.getvalue()).decode("utf-8")
data_uri = f"data:image/jpeg;base64,{b64_str}"

ts_content = f'export const LOGO_BASE64 = "{data_uri}";\n'
ts_path = os.path.join(root_dir, "src", "components", "report", "logoDataUri.ts")
with open(ts_path, "w") as f:
    f.write(ts_content)
print("Saved base64 data uri to", ts_path)
