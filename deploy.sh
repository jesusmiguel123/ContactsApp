mkdir production
cp -r backend/app/static/ production/static
cp -r frontend/dist/* production

docker compose -f docker-compose.prod.yml up