# How to run backstage with postgresql db locally

* Dockerfile and docker-compose should be configured already. These are the steps to run.
1. Build the backstage image:
```
docker image build -t backstage .
```
2. Run docker compose command to start database container:
```
docker-compose up -d
```
3. Copy and paste these secrets into env.sh (password and username will vary if docker-compose.yaml strays from this example)
```
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres
```
4. To stop the containers use the command:
```
docker-compose stop
```

