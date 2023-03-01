## Docker
### Creating network
```
docker network create back-front-db
```
### Backend
#### Building Docker image in `backend/`
```
docker build --rm -t back .
```
#### Creating container to develop in `/`
```
docker run \
   --rm \
   --network back-front-db \
   --hostname back \
   --name back \
   -v $PWD/backend:/home/app \
   -p 5000:5000 \
   -it \
   back sh
```
### Frontend
#### Building Docker image in `frontend/`
```
docker build --rm -t front .
```
#### Creating container to develop in `/`
```
docker run \
   --rm \
   --network back-front-db \
   --hostname front \
   --name front \
   -v $PWD/frontend:/home/app \
   -p 3000:3000 \
   -it \
   front sh
```

### Database
#### Creating Postgres container
```
docker run \
   --rm \
   --network back-front-db \
   --hostname db \
   --name db \
   -e POSTGRES_USER=pguser \
   -e POSTGRES_PASSWORD=asd123 \
   -e POSTGRES_DB=app \
   -v $PWD/database:/var/lib/postgresql/data \
   -p 5432:5432 \
   postgres:15.2-alpine
```