# Deploy Logto from GHCR

This deployment uses the image published by GitHub Actions:

```text
ghcr.io/sdvico/logto:develop
```

The server needs Docker Engine, Docker Compose v2, DNS records for the two public URLs, and HTTPS termination through a reverse proxy or load balancer.

## 1. Install the files

Copy this directory to the server and create the environment file:

```bash
cp .env.example .env
${EDITOR:-vi} .env
```

Set `ENDPOINT`, `ADMIN_ENDPOINT`, and a strong `POSTGRES_PASSWORD`. Do not commit `.env`.

## 2. Log in to GHCR

For a private image, create a GitHub Personal Access Token (classic) with only `read:packages`. `GITHUB_TOKEN` from GitHub Actions is not reusable on a server.

```bash
read -s GHCR_TOKEN
printf '%s' "$GHCR_TOKEN" | docker login ghcr.io \
  --username YOUR_GITHUB_USERNAME \
  --password-stdin
unset GHCR_TOKEN
```

If the package is public, this login is optional.

## 3. Pull and start

```bash
docker compose --env-file .env -f docker-compose.server.yml pull
docker compose --env-file .env -f docker-compose.server.yml up -d
```

The app container seeds the database and deploys the configured alteration target before starting Logto. For the `develop` image, keep `ALTERATION_TARGET=next` so the IAM migrations are applied.

Check the result:

```bash
docker compose --env-file .env -f docker-compose.server.yml ps
docker compose --env-file .env -f docker-compose.server.yml logs -f app
```

## 4. Upgrade the image

Change `IMAGE_TAG` in `.env`, then run:

```bash
docker compose --env-file .env -f docker-compose.server.yml pull app
docker compose --env-file .env -f docker-compose.server.yml up -d app
```

The PostgreSQL data is stored in the named volume `logto-postgres-data`. Back it up before upgrades or database maintenance.
