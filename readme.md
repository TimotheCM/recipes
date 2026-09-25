# Description of the software

The software is already deployed on:
https://recipe-finder.timothecormier.fr/


Recipe Finder is a recipe search website. By simply writing a recipe or an ingredient name in the search bar, the website searches a database of 120 000 recipes, so you have plenty of choices for your meal!
An Express frontend sends each search to several FastAPI workers in parallel, which look for matching recipes in a PostgreSQL database.

It uses the recipe dataset from https://eightportions.com/datasets/Recipes/#fn:1

# Production

Build the images and push them to Docker Hub:
```bash
docker login
docker compose build
docker compose push
```

## With Kubernetes

```bash
cp k8s/secret.example.yaml k8s/secret.yaml
```

Deploy:
```bash
kubectl apply -f k8s/
```

Then open with
```
minikube service frontend
```


To remove everything:
```bash
kubectl delete -f k8s/
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

https://docs.docker.com/guides/postgresql/
