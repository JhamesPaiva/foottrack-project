from marshmallow import ValidationError
from app.models import Jogador, EstatisticaJogador
from app.repositories import JogadorRepository, EstatisticaRepository
from app.schemas import JogadorSchema
from app.utils import deletar_imagem

MAX_JOGADORES = 40


class JogadorService:
    def __init__(self) -> None:
        self.repo = JogadorRepository()
        self.est_repo = EstatisticaRepository()
        self.schema = JogadorSchema()

    def listar(self, temporada_id: int) -> list[Jogador]:
        return self.repo.get_by_temporada(temporada_id)

    def criar(self, temporada_id: int, data: dict) -> Jogador:
        errors = self.schema.validate(data)
        if errors:
            raise ValidationError(errors)
        if self.repo.count_by_temporada(temporada_id) >= MAX_JOGADORES:
            raise ValidationError({"jogador": [f"Limite de {MAX_JOGADORES} jogadores atingido."]})

        jogador = Jogador(
            temporada_id=temporada_id,
            nome=data["nome"],
            posicao=data.get("posicao"),
        )
        self.repo.save(jogador)
        # Create initial stats record
        est = EstatisticaJogador(jogador_id=jogador.id)
        self.est_repo.save(est)
        return jogador

    def atualizar(self, jogador: Jogador, data: dict) -> Jogador:
        errors = self.schema.validate(data, partial=True)
        if errors:
            raise ValidationError(errors)
        for key, val in data.items():
            if hasattr(jogador, key) and key not in ("id", "temporada_id", "foto"):
                setattr(jogador, key, val)
        return self.repo.save(jogador)

    def atualizar_foto(self, jogador: Jogador, caminho: str) -> Jogador:
        deletar_imagem(jogador.foto)
        jogador.foto = caminho
        return self.repo.save(jogador)

    def deletar(self, jogador: Jogador) -> None:
        deletar_imagem(jogador.foto)
        self.repo.delete(jogador)
