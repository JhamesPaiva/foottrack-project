from datetime import date
from marshmallow import ValidationError
from app.models import Temporada
from app.repositories import TemporadaRepository
from app.schemas import TemporadaSchema


class TemporadaService:
    def __init__(self) -> None:
        self.repo = TemporadaRepository()
        self.schema = TemporadaSchema()

    def listar(self, time_id: int) -> list[Temporada]:
        return self.repo.get_by_time(time_id)

    def criar(self, time_id: int, data: dict) -> Temporada:
        errors = self.schema.validate(data)
        if errors:
            raise ValidationError(errors)
        temporada = Temporada(
            time_id=time_id,
            nome=data["nome"],
            data_inicio=data.get("data_inicio"),
            data_fim=data.get("data_fim"),
            status="ativa",
        )
        return self.repo.save(temporada)

    def encerrar(self, temporada: Temporada) -> Temporada:
        temporada.status = "encerrada"
        temporada.data_fim = date.today()
        return self.repo.save(temporada)

    def reabrir(self, temporada: Temporada) -> Temporada:
        temporada.status = "ativa"
        temporada.data_fim = None
        return self.repo.save(temporada)
