FROM python:3.14-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl unzip \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir psycopg2-binary

COPY . /script

CMD ["python", "/script/save_dataset_to_db.py"]
