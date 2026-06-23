import os

from django.contrib.staticfiles import finders
from django.contrib.staticfiles.storage import staticfiles_storage

DEFAULT_LOGO_PATH = "config/images/company_logo.png"


def versioned_static_url(relative_path: str) -> str:
    """Absolute static URL with file mtime cache-bust when the file exists."""
    path = relative_path.lstrip("/")
    found = finders.find(path)
    use_path = path
    if not found:
        fallback = DEFAULT_LOGO_PATH
        if path != fallback and finders.find(fallback):
            use_path = fallback
        found = finders.find(use_path)

    url = staticfiles_storage.url(use_path)
    if not url.startswith(("http://", "https://", "/")):
        url = f"/{url.lstrip('/')}"

    if not found:
        return url

    try:
        mtime = int(os.path.getmtime(found))
    except OSError:
        return url
    separator = "&" if "?" in url else "?"
    return f"{url}{separator}v={mtime}"


def logo_mime_type(relative_path: str) -> str:
    ext = os.path.splitext(relative_path)[1].lower()
    return {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
    }.get(ext, "image/png")
