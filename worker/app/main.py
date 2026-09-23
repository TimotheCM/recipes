from typing import Annotated

from fastapi import FastAPI, HTTPException, Query
from rapidfuzz import fuzz
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

@app.get("/recipes/")
def read_recipes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[RecipeSummary]:
    recipes = session.exec(select(Recipe).offset(offset).limit(limit)).all()
    return recipes


@app.get("/search")
def search(
    q: Annotated[str, Query(min_length=1)],
    session: SessionDep,
    shard: int = 0,
    shards: int = 1,
):

    recipes = session.exec(
        select(Recipe.title, Recipe.ingredients, Recipe.instructions).where(
            Recipe.id % shards == shard
        )
    ).all()

    words = q.lower().split()
    results = []
    for title, ingredients, instructions in recipes:
        fields = [
            (title.lower(), 1),
            (" ".join(ingredients).lower(), 0.9),
            (instructions.lower(), 0.6),
        ]

        field_scores = []
        for field, weight in fields:
            word_scores = []
            for word in words:
                word_scores.append(fuzz.partial_ratio(word, field))
            field_scores.append(min(word_scores) * weight)

        score = max(field_scores)

        if score >= 80:
            results.append({"title": title, "score": round(score)})

    results.sort(key=lambda result: result["score"], reverse=True)

    return {"results": results[:10]}


@app.get("/recipes/{title:path}")
def read_recipe(title: str, session: SessionDep) -> Recipe:
    recipe = session.exec(select(Recipe).where(Recipe.title == title)).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe
