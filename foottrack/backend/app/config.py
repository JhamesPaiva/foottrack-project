import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class BaseConfig:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "TROQUE-ESTA-CHAVE-EM-PRODUCAO")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "TROQUE-ESTA-CHAVE-JWT-EM-PRODUCAO")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH: int = int(os.getenv("MAX_CONTENT_LENGTH", 5 * 1024 * 1024))
    UPLOAD_FOLDER: str = os.getenv("UPLOAD_FOLDER", "uploads")
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

    RATELIMIT_STORAGE_URI: str = os.getenv("RATELIMIT_STORAGE_URI", "memory://")
    RATELIMIT_DEFAULT = "200 per day;50 per hour"

    @staticmethod
    def _db_uri() -> str:
        host = os.getenv("DB_HOST", "localhost")
        port = os.getenv("DB_PORT", "3306")
        name = os.getenv("DB_NAME", "foottrack")
        user = os.getenv("DB_USER", "root")
        pwd = os.getenv("DB_PASSWORD", "root")
        return f"mysql+pymysql://{user}:{pwd}@{host}:{port}/{name}"

    SQLALCHEMY_DATABASE_URI = _db_uri.__func__()  # type: ignore[attr-defined]


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]


class ProductionConfig(BaseConfig):
    DEBUG = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)


config_by_name: dict = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}