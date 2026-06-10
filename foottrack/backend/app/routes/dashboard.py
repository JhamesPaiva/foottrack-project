from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import DashboardController

dashboard_bp = Blueprint("dashboard", __name__)
ctrl = DashboardController()

@dashboard_bp.route("", methods=["GET"])
@jwt_required()
def get_resumo():
    return ctrl.get_resumo()
