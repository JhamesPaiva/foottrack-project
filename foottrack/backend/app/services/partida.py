from marshmallow import ValidationError
from app.extensions import db
from app.models import Partida, EstatisticaPartida, Historico
from app.repositories import PartidaRepository, EstatisticaRepository, HistoricoRepository
from app.schemas import PartidaCreateSchema


class PartidaService:
    def __init__(self) -> None:
        self.repo = PartidaRepository()
        self.est_repo = EstatisticaRepository()
        self.hist_repo = HistoricoRepository()
        self.schema = PartidaCreateSchema()

    def listar(self, temporada_id: int) -> list[Partida]:
        return self.repo.get_by_temporada(temporada_id)

    def estatisticas_time(self, temporada_id: int) -> dict:
        return self.repo.get_estatisticas_time(temporada_id)

    def criar(self, temporada_id: int, usuario_id: int, data: dict) -> Partida:
        errors = self.schema.validate(data)
        if errors:
            raise ValidationError(errors)

        estatisticas_data = data.pop("estatisticas", [])

        partida = Partida(
            temporada_id=temporada_id,
            adversario_id=data["adversario_id"],
            data_partida=data["data_partida"],
            horario=data.get("horario"),
            local=data.get("local"),
            competicao=data.get("competicao"),
            rodada=data.get("rodada"),
            observacoes=data.get("observacoes"),
            mandante=data.get("mandante", True),
            gols_pro=data["gols_pro"],
            gols_contra=data["gols_contra"],
        )
        partida.resultado = partida.calcular_resultado()
        db.session.add(partida)
        db.session.flush()  # get partida.id before commit

        # Process player stats
        self._processar_estatisticas(partida, estatisticas_data, usuario_id)

        db.session.commit()
        db.session.refresh(partida)
        return partida

    def atualizar(self, partida: Partida, usuario_id: int, data: dict) -> Partida:
        estatisticas_data = data.pop("estatisticas", None)

        for key, val in data.items():
            if hasattr(partida, key) and key not in ("id", "temporada_id", "resultado"):
                setattr(partida, key, val)
        partida.resultado = partida.calcular_resultado()

        if estatisticas_data is not None:
            # Remove old stats and recompute
            for ep in partida.estatisticas:
                est_j = self.est_repo.get_or_create_jogador(ep.jogador_id)
                est_j.jogos = max(0, est_j.jogos - (1 if ep.participou else 0))
                est_j.gols = max(0, est_j.gols - ep.gols)
                est_j.assistencias = max(0, est_j.assistencias - ep.assistencias)
                est_j.cartoes_amarelos = max(0, est_j.cartoes_amarelos - ep.cartoes_amarelos)
                est_j.cartoes_vermelhos = max(0, est_j.cartoes_vermelhos - ep.cartoes_vermelhos)
                est_j.recalcular_pontos()
                db.session.delete(ep)
            db.session.flush()
            self._processar_estatisticas(partida, estatisticas_data, usuario_id)

        db.session.commit()
        db.session.refresh(partida)
        return partida

    def deletar(self, partida: Partida) -> None:
        # Revert player stats
        for ep in partida.estatisticas:
            est_j = self.est_repo.get_or_create_jogador(ep.jogador_id)
            if ep.participou:
                est_j.jogos = max(0, est_j.jogos - 1)
            est_j.gols = max(0, est_j.gols - ep.gols)
            est_j.assistencias = max(0, est_j.assistencias - ep.assistencias)
            est_j.cartoes_amarelos = max(0, est_j.cartoes_amarelos - ep.cartoes_amarelos)
            est_j.cartoes_vermelhos = max(0, est_j.cartoes_vermelhos - ep.cartoes_vermelhos)
            est_j.recalcular_pontos()
        self.repo.delete(partida)

    def _processar_estatisticas(self, partida: Partida, estatisticas_data: list, usuario_id: int) -> None:
        adversario_nome = partida.adversario.nome if partida.adversario else f"Adversário #{partida.adversario_id}"

        for item in estatisticas_data:
            jogador_id = item["jogador_id"]
            ep = EstatisticaPartida(
                partida_id=partida.id,
                jogador_id=jogador_id,
                participou=item.get("participou", True),
                gols=item.get("gols", 0),
                assistencias=item.get("assistencias", 0),
                cartoes_amarelos=item.get("cartoes_amarelos", 0),
                cartoes_vermelhos=item.get("cartoes_vermelhos", 0),
            )
            db.session.add(ep)

            # Update aggregated stats
            est_j = self.est_repo.get_or_create_jogador(jogador_id)
            if ep.participou:
                est_j.jogos += 1
            est_j.gols += ep.gols
            est_j.assistencias += ep.assistencias
            est_j.cartoes_amarelos += ep.cartoes_amarelos
            est_j.cartoes_vermelhos += ep.cartoes_vermelhos
            est_j.recalcular_pontos()

            # Generate history entries
            jogador_nome = ep.jogador.nome if hasattr(ep, 'jogador') and ep.jogador else f"Jogador #{jogador_id}"
            eventos = []
            if ep.gols > 0:
                eventos.append(f"{jogador_nome} marcou {ep.gols} gol(s) contra {adversario_nome}")
            if ep.assistencias > 0:
                eventos.append(f"{jogador_nome} deu {ep.assistencias} assistência(s) contra {adversario_nome}")
            if ep.cartoes_amarelos > 0:
                eventos.append(f"{jogador_nome} recebeu {ep.cartoes_amarelos} cartão(ões) amarelo(s)")
            if ep.cartoes_vermelhos > 0:
                eventos.append(f"{jogador_nome} recebeu cartão vermelho")

            for desc in eventos:
                hist = Historico(
                    usuario_id=usuario_id,
                    jogador_id=jogador_id,
                    partida_id=partida.id,
                    descricao=desc,
                )
                db.session.add(hist)
