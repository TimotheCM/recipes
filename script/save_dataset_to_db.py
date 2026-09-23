import json
import os
import subprocess
import time
from pathlib import Path

import psycopg2
from psycopg2.extras import execute_values

SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"

deadline = time.time() + 60
while True:
    try:
        connection = psycopg2.connect(
            host=os.environ.get("POSTGRES_HOST", "localhost"),
            dbname=os.environ.get("POSTGRES_DB", "recipes"),
            user=os.environ.get("POSTGRES_USER", "recipes"),
            password=os.environ.get("POSTGRES_PASSWORD", "mysecretpassword"),
        )
        with connection, connection.cursor() as cursor:
            cursor.execute("SELECT count(*) FROM recipe")
            already_there = cursor.fetchone()[0]
        break
    except psycopg2.Error:
        if time.time() > deadline:
            raise
        print("Waiting for the database ...")
        time.sleep(2)

if already_there > 0:
    print("The database already has recipes, nothing to do")
    raise SystemExit(0)


subprocess.run([SCRIPT_DIR / "download_recipes_dataset"], check=True)

rows = []
seen_titles = {}

for file in sorted(DATA_DIR.glob("*.json")):
    recipes = json.loads(file.read_text())

    for recipe in recipes.values():
        title = (recipe.get("title") or "").strip()
        instructions = (recipe.get("instructions") or "").strip()

        if not title or not instructions:
            continue

        # Remove "ADVERTISEMENT" in ingredients
        ingredients = []
        for ingredient in recipe.get("ingredients") or []:
            ingredient = ingredient.replace("ADVERTISEMENT", "").strip()
            if ingredient:
                ingredients.append(ingredient)

        # Titles must be unique
        count = seen_titles.get(title, 0) + 1
        seen_titles[title] = count
        if count > 1:
            title = f"{title}_{count}"

        rows.append((title, json.dumps(ingredients), instructions))

    print(f"{file.name} read")


with connection, connection.cursor() as cursor:
    cursor.execute("TRUNCATE recipe RESTART IDENTITY")

    execute_values(
        cursor,
        "INSERT INTO recipe (title, ingredients, instructions) VALUES %s",
        rows,
        template="(%s, %s::json, %s)",
        page_size=1000,
    )

connection.close()
print(f"{len(rows)} recipes saved in the database")
