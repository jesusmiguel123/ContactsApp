## Docker
### Creating network
```
docker network create py-pg
```
### Building Docker image
```
docker build --rm -t py-pgsql .
```
### Creating container to develop
```
docker run \
   --rm \
   --network py-pg \
   --hostname py \
   --name py \
   -v $PWD/backend:/home/app \
   -p 5000:5000 \
   -it \
   py-pgsql sh
```

### Creating Postgres container
```
docker run \
   --rm \
   --network py-pg \
   --hostname pg \
   --name pg \
   -e POSTGRES_USER=pguser \
   -e POSTGRES_PASSWORD=asd123 \
   -v $PWD/database:/var/lib/postgresql/data \
   -p 5432:5432 \
   postgres:15.2-alpine
```