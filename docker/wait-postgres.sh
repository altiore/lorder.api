#!/usr/bin/env bash

until psql -h "localhost" -U "$POSTGRES_USER" -c '\l'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
