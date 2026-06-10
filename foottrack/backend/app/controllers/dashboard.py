from flask_jwt_extended import get_jwt_identity
from app.services import DashboardService
from app.utils import success_response


class DashboardController:
    def __init__(self) -> None:
        self.service = DashboardService()

    def get_resumo(self):
        uid = int(get_jwt_identity())
        data = self.service.get_resumo(uid)
        return success_response(data)
