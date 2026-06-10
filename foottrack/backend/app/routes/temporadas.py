from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import TemporadaController

temporadas_bp = Blueprint("temporadas", __name__)
ctrl = TemporadaController()

@temporadas_bp.route("/times/<int:time_id>/temporadas", methods=["GET"])
@jwt_required()
def listar(time_id):
    return ctrl.listar(time_id)

@temporadas_bp.route("/times/<int:time_id>/temporadas", methods=["POST"])
@jwt_required()
def criar(time_id):
    return ctrl.criar(time_id)

@temporadas_bp.route("/temporadas/<int:temporada_id>/encerrar", methods=["POST"])
@jwt_required()
def encerrar(temporada_id):
    return ctrl.encerrar(temporada_id)

@temporadas_bp.route("/temporadas/<int:temporada_id>/reabrir", methods=["POST"])
@jwt_required()
def reabrir(temporada_id):
    return ctrl.reabrir(temporada_id)
