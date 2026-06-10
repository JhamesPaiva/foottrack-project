from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import AuthController

auth_bp = Blueprint("auth", __name__)
ctrl = AuthController()

auth_bp.add_url_rule("/register", view_func=ctrl.register, methods=["POST"])
auth_bp.add_url_rule("/login", view_func=ctrl.login, methods=["POST"])
