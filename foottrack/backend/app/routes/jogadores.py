from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import JogadorController

jogadores_bp = Blueprint("jogadores", __name__)
ctrl = JogadorController()

@jogadores_bp.route("/temporadas/<int:temporada_id>/jogadores", methods=["GET"])
@jwt_required()
def listar(temporada_id):
    return ctrl.listar(temporada_id)

@jogadores_bp.route("/temporadas/<int:temporada_id>/jogadores", methods=["POST"])
@jwt_required()
def criar(temporada_id):
    return ctrl.criar(temporada_id)

@jogadores_bp.route("/jogadores/<int:jogador_id>", methods=["GET"])
@jwt_required()
def get(jogador_id):
    return ctrl.get(jogador_id)

@jogadores_bp.route("/jogadores/<int:jogador_id>", methods=["PUT"])
@jwt_required()
def atualizar(jogador_id):
    return ctrl.atualizar(jogador_id)

@jogadores_bp.route("/jogadores/<int:jogador_id>", methods=["DELETE"])
@jwt_required()
def deletar(jogador_id):
    return ctrl.deletar(jogador_id)

@jogadores_bp.route("/jogadores/<int:jogador_id>/foto", methods=["POST"])
@jwt_required()
def foto(jogador_id):
    return ctrl.atualizar_foto(jogador_id)

@jogadores_bp.route("/jogadores/<int:jogador_id>/historico", methods=["GET"])
@jwt_required()
def historico(jogador_id):
    return ctrl.get_historico(jogador_id)
