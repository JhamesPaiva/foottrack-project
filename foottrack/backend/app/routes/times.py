from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import TimeController

times_bp = Blueprint("times", __name__)
ctrl = TimeController()

@times_bp.route("", methods=["GET"])
@jwt_required()
def listar():
    return ctrl.listar()

@times_bp.route("", methods=["POST"])
@jwt_required()
def criar():
    return ctrl.criar()

@times_bp.route("/<int:time_id>", methods=["GET"])
@jwt_required()
def get(time_id):
    return ctrl.get(time_id)

@times_bp.route("/<int:time_id>", methods=["PUT"])
@jwt_required()
def atualizar(time_id):
    return ctrl.atualizar(time_id)

@times_bp.route("/<int:time_id>", methods=["DELETE"])
@jwt_required()
def deletar(time_id):
    return ctrl.deletar(time_id)

@times_bp.route("/<int:time_id>/escudo", methods=["POST"])
@jwt_required()
def escudo(time_id):
    return ctrl.atualizar_escudo(time_id)