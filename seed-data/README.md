# Seed Data

This folder contains the initial database and product images for deployment.

## Usage (on VPS)

```bash
cd /opt/xlab

# Copy database to Docker volume directory
cp seed-data/dev.db data/db/dev.db

# Extract product images to Docker volume directory
tar xzf seed-data/uploads.tar.gz -C data/

# Restart the container
docker restart xlab-web
```

## Contents

- `dev.db` — SQLite database with all products, categories, and user data
- `uploads.tar.gz` — Product images (extracted to `data/uploads/`)
