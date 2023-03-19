# Contacts App
The Contacts App is an application where you can connect with other person. You can register an upload an profile photo.

It provides an administration side on `/admin` route.

This application was developed with:
- `PostgreSQL`
- `Flask`
- `ReactJS`
- `React-Router-DOM-v6`
- `Docker`

And was deployed with:
- `NGINX`

## Docker
Execute the following commands to run the Contacts App with Docker
### Creating network
```
docker network create back-front-db
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
### Backend
#### Building Docker image in `backend/`
```
docker build -f Dockerfile.dev --rm -t back .
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
   back
```
### Frontend
#### Building Docker image in `frontend/`
```
docker build -f Dockerfile.dev --rm -t front .
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
   front
```

## Docker Compose
You must have `Docker Compose V2`. If you don't have that version use the following command on Linux:
```
sudo sh install-docker-compose-v2.sh
```
### Development
Run the next command to start development mode:
```
docker compose -f docker-compose.dev.yml up
```
### Production
First you need to have the `build` directory in `/frontend`. You can do it with the next command if you developed locally:
```
npm run build
```
If you developed in the docker container exec:
```
docker exec -it front npm run build
```
Then run the next command to start production mode:
```
sh deploy.sh
```