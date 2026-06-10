import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class BaseConfig:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH: int = int(os.getenv("MAX_CONTENT_LENGTH", 5 * 1024 * 1024))
    UPLOAD_FOLDER: str = os.getenv("UPLOAD_FOLDER", "uploads")
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

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


class ProductionConfig(BaseConfig):
    DEBUG = False


config_by_name: dict = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
