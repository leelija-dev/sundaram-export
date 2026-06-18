import os

from django.contrib.staticfiles import finders
from django.contrib.staticfiles.storage import staticfiles_storage


def versioned_static_url(relative_path: str) -> str:
    """Absolute static URL with file mtime cache-bust when the file exists."""
    path = relative_path.lstrip("/")
    url = staticfiles_storage.url(path)
    found = finders.find(path)
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
