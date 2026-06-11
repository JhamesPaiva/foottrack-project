from flask import Blueprint
from app.controllers import AuthController
from app.extensions import limiter

auth_bp = Blueprint("auth", __name__)
ctrl = AuthController()

@auth_bp.route("/register", methods=["POST"])
@limiter.limit("10 per hour")
def register():
    return ctrl.register()

@auth_bp.route("/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():
    return ctrl.login()