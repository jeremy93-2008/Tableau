#!/bin/sh

# -e Exit immediately when a command returns a non-zero status.
# -x Print commands before they are executed
set -ex
# Seeding command
psql -U postgres -d tableau -a -f /app/scripts/db/schemadb.sql
psql -U postgres -d tableau -a -f /app/scripts/db/datadb.sql