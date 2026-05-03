from pathlib import Path
import re
import uuid


class StorageService:
    def __init__(self, storage_dir: str):
        self.root = Path(storage_dir)
        self.root.mkdir(parents=True, exist_ok=True)

    def save_bytes(self, file_name: str, content: bytes) -> Path:
        safe_name = self._sanitize(file_name)
        target = self.root / "{0}-{1}".format(uuid.uuid4().hex, safe_name)
        target.write_bytes(content)
        return target

    def delete(self, path: Path):
        if path.exists():
            path.unlink()

    def _sanitize(self, file_name: str) -> str:
        cleaned = re.sub(r"[^A-Za-z0-9._-]", "-", file_name or "document")
        return cleaned[:120] or "document"

