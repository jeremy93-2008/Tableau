FROM postgres
WORKDIR /app
COPY ./seed.sh /docker-entrypoint-initdb.d
COPY ./dump.sql ./scripts/db/dump.sql
