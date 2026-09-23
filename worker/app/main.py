from typing import Annotated

from fastapi import FastAPI, HTTPException, Query
from sqlmodel import select

from app.database import SessionDep, create_db_and_tables
from app.models import Recipe, RecipeBase, RecipeSummary

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/recipes/")
def create_recipe(recipe: RecipeBase, session: SessionDep) -> Recipe:
    db_recipe = Recipe.model_validate(recipe)
    session.add(db_recipe)
    session.commit()
    session.refresh(db_recipe)
    return db_recipe



@app.get("/test/")
def qsdqsdqsd():
    return "hello ozrddd"


@app.get("/recipes/")
def read_recipes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[RecipeSummary]:
    recipes = session.exec(select(Recipe).offset(offset).limit(limit)).all()
    return recipes



@app.get("/recipes/{title:path}")
def read_recipe(title: str, session: SessionDep) -> Recipe:
    recipe = session.exec(select(Recipe).where(Recipe.title == title)).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe
