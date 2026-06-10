from marshmallow import ValidationError
from app.models import Time
from app.repositories import TimeRepository
from app.schemas import TimeSchema
from app.utils import deletar_imagem


class TimeService:
    def __init__(self) -> None:
        self.repo = TimeRepository()
        self.schema = TimeSchema()

    def listar(self, usuario_id: int) -> list[Time]:
        return self.repo.get_by_usuario(usuario_id)

    def criar(self, usuario_id: int, data: dict) -> Time:
        errors = self.schema.validate(data)
        if errors:
            raise ValidationError(errors)
        time = Time(usuario_id=usuario_id, **{k: v for k, v in data.items() if hasattr(Time, k)})
        return self.repo.save(time)

    def atualizar(self, time: Time, data: dict) -> Time:
        errors = self.schema.validate(data, partial=True)
        if errors:
            raise ValidationError(errors)
        for key, val in data.items():
            if hasattr(time, key) and key not in ("id", "usuario_id", "escudo"):
                setattr(time, key, val)
        return self.repo.save(time)

    def atualizar_escudo(self, time: Time, caminho: str) -> Time:
        deletar_imagem(time.escudo)
        time.escudo = caminho
        return self.repo.save(time)

    def deletar(self, time: Time) -> None:
        deletar_imagem(time.escudo)
        self.repo.delete(time)
