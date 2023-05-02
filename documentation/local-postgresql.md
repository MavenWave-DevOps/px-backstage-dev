# How to run backstage with postgresql db locally
1. Run docker compose command to start database container:
```
docker-compose up -d
```
2. Copy and paste these secrets into env.sh (password and username will vary if docker-compose.yaml strays from this example)
```
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres
```
