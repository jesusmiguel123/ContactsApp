mkdir production
cp -r backend/app/static/ production/static
cp -r frontend/build/* production

docker compose -f docker-compose.prod.yml up