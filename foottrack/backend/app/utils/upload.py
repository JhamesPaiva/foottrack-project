import os
import uuid
from pathlib import Path
from flask import current_app
from werkzeug.datastructures import FileStorage
from PIL import Image


def allowed_file(filename: str) -> bool:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in current_app.config["ALLOWED_EXTENSIONS"]


def salvar_imagem(file: FileStorage, subfolder: str = "escudos") -> str:
    """Save uploaded image, resize if needed, return relative path."""
    ext = file.filename.rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    folder = Path(current_app.config["UPLOAD_FOLDER"]) / subfolder
    folder.mkdir(parents=True, exist_ok=True)
    filepath = folder / filename

    img = Image.open(file)
    img.thumbnail((800, 800))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(filepath, optimize=True, quality=85)

    return f"{subfolder}/{filename}"


def deletar_imagem(path: str | None) -> None:
    if not path:
        return
    full = Path(current_app.config["UPLOAD_FOLDER"]) / path
    if full.exists():
        full.unlink()
