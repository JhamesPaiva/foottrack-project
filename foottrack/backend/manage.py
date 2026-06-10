import os
from flask_migrate import upgrade
from app import create_app
from app.extensions import db

app = create_app(os.getenv("FLASK_ENV", "development"))

@app.cli.command("init-db")
def init_db():
    """Create all tables."""
    with app.app_context():
        db.create_all()
        print("Database tables created successfully.")

if __name__ == "__main__":
    app.run()
