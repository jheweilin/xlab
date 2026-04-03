#!/bin/sh
set -e

# If database doesn't exist, copy the initial empty database
if [ ! -f /app/data/dev.db ]; then
  echo "Database not found, copying initial database..."
  cp /app/init.db /app/data/dev.db
  echo "Database initialized."
fi

exec node server.js
