FROM postgres
WORKDIR /app
COPY ./seed.sh /docker-entrypoint-initdb.d
COPY ./schemadb.sql ./scripts/db/schemadb.sql
COPY ./datadb.sql ./scripts/db/datadb.sql
