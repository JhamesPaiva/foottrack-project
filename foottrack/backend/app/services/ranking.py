from app.repositories import EstatisticaRepository


class RankingService:
    def __init__(self) -> None:
        self.repo = EstatisticaRepository()

    def get_ranking(self, temporada_id: int) -> list:
        return self.repo.get_ranking(temporada_id)

    def get_artilheiro(self, temporada_id: int):
        ranking = self.get_ranking(temporada_id)
        return max(ranking, key=lambda e: e.gols, default=None) if ranking else None

    def get_lider_assistencias(self, temporada_id: int):
        ranking = self.get_ranking(temporada_id)
        return max(ranking, key=lambda e: e.assistencias, default=None) if ranking else None
