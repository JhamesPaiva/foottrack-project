from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import RankingController

ranking_bp = Blueprint("ranking", __name__)
ctrl = RankingController()

@ranking_bp.route("/temporadas/<int:temporada_id>/ranking", methods=["GET"])
@jwt_required()
def get_ranking(temporada_id):
    return ctrl.get_ranking(temporada_id)

@ranking_bp.route("/temporadas/<int:temporada_id>/destaques", methods=["GET"])
@jwt_required()
def get_destaques(temporada_id):
    return ctrl.get_destaques(temporada_id)
