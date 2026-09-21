# Recipes

A recipe search website. An Express frontend sends each search to several FastAPI workers in parallel, which look for matching recipes in a PostgreSQL database.

# Production

Build the images and push them to Docker Hub:
```bash
docker login
docker compose build
docker compose push
```

## With Docker Compose

`-f compose.yaml` loads only the production config and skips `compose.override.yaml` (the dev settings).

To start the whole stack:
```bash
docker compose -f compose.yaml up -d
```

To stop the whole stack:
```bash
docker compose -f compose.yaml down
```


# Development

## Script for download the recipes dataset
Download the recipes dataset into the `data` folder:

```bash
./script/download_recipes_dataset
```

## Local dev with Docker Compose

To start the whole stack:
```bash
docker compose up -d
```

Add `--build` after changing a Dockerfile or the dependencies (`package.json`, `pyproject.toml`):
```bash
docker compose up -d --build
```

Then open:
- http://localhost:3001/ for the frontend
- http://localhost:8000/docs for the worker documentation

To stop the whole stack:
```bash
docker compose down
```



# Useful links and articles

## Reminders

Git vocabulary
https://talks.freelancerepublik.com/wp-content/uploads/2021/12/Git-Architechture.png

How to write good commit messages
https://www.conventionalcommits.org/en/v1.0.0/

## Useful documentation
https://expressjs.com/en/5x/starter/installing/

https://fastapi.tiangolo.com/#create-it

https://socket.io/docs/v4/tutorial/introduction

https://docs.docker.com/guides/postgresql/
