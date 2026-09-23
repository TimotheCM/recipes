from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


class RecipeBase(SQLModel):
    title: str = Field(index=True, unique=True)
    ingredients: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    instructions: str


class Recipe(RecipeBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class RecipeSummary(SQLModel):
    title: str
