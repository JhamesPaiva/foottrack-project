from marshmallow import ValidationError
from app.models import Adversario
from app.repositories import AdversarioRepository
from app.schemas import AdversarioSchema
from app.utils import deletar_imagem


class AdversarioService:
    def __init__(self) -> None:
        self.repo = AdversarioRepository()
        self.schema = AdversarioSchema()

    def listar(self, usuario_id: int) -> list[Adversario]:
        return self.repo.get_by_usuario(usuario_id)

    def criar(self, usuario_id: int, data: dict) -> Adversario:
        errors = self.schema.validate(data)
        if errors:
            raise ValidationError(errors)
        adv = Adversario(usuario_id=usuario_id, nome=data["nome"],
                         cidade=data.get("cidade"), categoria=data.get("categoria"))
        return self.repo.save(adv)

    def atualizar(self, adv: Adversario, data: dict) -> Adversario:
        errors = self.schema.validate(data, partial=True)
        if errors:
            raise ValidationError(errors)
        for key, val in data.items():
            if hasattr(adv, key) and key not in ("id", "usuario_id", "escudo"):
                setattr(adv, key, val)
        return self.repo.save(adv)

    def atualizar_escudo(self, adv: Adversario, caminho: str) -> Adversario:
        deletar_imagem(adv.escudo)
        adv.escudo = caminho
        return self.repo.save(adv)

    def deletar(self, adv: Adversario) -> None:
        deletar_imagem(adv.escudo)
        self.repo.delete(adv)
