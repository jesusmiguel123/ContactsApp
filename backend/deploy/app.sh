#!bin/sh

flask check-db
flask init-db
flask initial-admin

NAME="app"
LOG_LEVEL=debug
USER=app
GROUP=app
NUM_WORKERS=5
FLASK_WSGI_MODULE=wsgi

gunicorn ${FLASK_WSGI_MODULE}:app \
   --bind 0.0.0.0:5000 \
   --name $NAME \
   --worker-connections 1000 \
   --workers $NUM_WORKERS \
   --user $USER \
   --group $GROUP \
   --log-level $LOG_LEVEL