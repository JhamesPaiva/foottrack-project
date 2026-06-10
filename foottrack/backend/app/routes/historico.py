from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import HistoricoController

historico_bp = Blueprint("historico", __name__)
ctrl = HistoricoController()

@historico_bp.route("", methods=["GET"])
@jwt_required()
def listar():
    return ctrl.listar()
