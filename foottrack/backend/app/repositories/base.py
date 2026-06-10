from typing import TypeVar, Generic, Type, Optional
from app.extensions import db

T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T]) -> None:
        self.model = model

    def get_by_id(self, id: int) -> Optional[T]:
        return db.session.get(self.model, id)

    def get_all(self) -> list[T]:
        return db.session.execute(db.select(self.model)).scalars().all()

    def save(self, obj: T) -> T:
        db.session.add(obj)
        db.session.commit()
        db.session.refresh(obj)
        return obj

    def delete(self, obj: T) -> None:
        db.session.delete(obj)
        db.session.commit()

    def commit(self) -> None:
        db.session.commit()
