from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import PartidaController

partidas_bp = Blueprint("partidas", __name__)
ctrl = PartidaController()

@partidas_bp.route("/temporadas/<int:temporada_id>/partidas", methods=["GET"])
@jwt_required()
def listar(temporada_id):
    return ctrl.listar(temporada_id)

@partidas_bp.route("/temporadas/<int:temporada_id>/partidas", methods=["POST"])
@jwt_required()
def criar(temporada_id):
    return ctrl.criar(temporada_id)

@partidas_bp.route("/temporadas/<int:temporada_id>/estatisticas", methods=["GET"])
@jwt_required()
def estatisticas_time(temporada_id):
    return ctrl.estatisticas_time(temporada_id)

@partidas_bp.route("/partidas/<int:partida_id>", methods=["GET"])
@jwt_required()
def get(partida_id):
    return ctrl.get(partida_id)

@partidas_bp.route("/partidas/<int:partida_id>", methods=["PUT"])
@jwt_required()
def atualizar(partida_id):
    return ctrl.atualizar(partida_id)

@partidas_bp.route("/partidas/<int:partida_id>", methods=["DELETE"])
@jwt_required()
def deletar(partida_id):
    return ctrl.deletar(partida_id)
