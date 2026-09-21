FROM python:3.14-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /code

COPY pyproject.toml uv.lock /code/

RUN uv sync --frozen --no-dev --no-cache

ENV PATH="/code/.venv/bin:$PATH"

COPY ./app /code/app

CMD ["fastapi", "run", "app/main.py", "--port", "80"]
