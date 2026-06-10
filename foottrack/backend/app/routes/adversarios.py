from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import AdversarioController

adversarios_bp = Blueprint("adversarios", __name__)
ctrl = AdversarioController()

@adversarios_bp.route("", methods=["GET"])
@jwt_required()
def listar():
    return ctrl.listar()

@adversarios_bp.route("", methods=["POST"])
@jwt_required()
def criar():
    return ctrl.criar()

@adversarios_bp.route("/<int:adv_id>", methods=["PUT"])
@jwt_required()
def atualizar(adv_id):
    return ctrl.atualizar(adv_id)

@adversarios_bp.route("/<int:adv_id>", methods=["DELETE"])
@jwt_required()
def deletar(adv_id):
    return ctrl.deletar(adv_id)

@adversarios_bp.route("/<int:adv_id>/escudo", methods=["POST"])
@jwt_required()
def escudo(adv_id):
    return ctrl.atualizar_escudo(adv_id)
