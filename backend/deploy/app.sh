#!bin/sh

flask check-db
flask init-db
flask initial-admin

NAME="app"
FLASK_DIR=$(dirname $(cd `dirname $0` && pwd))
LOG_LEVEL=debug
USER=app
GROUP=app
NUM_WORKERS=5
DJANGO_WSGI_MODULE=config.wsgi

gunicorn ${DJANGO_WSGI_MODULE}:application \
   --bind 0.0.0.0:8000 \
   --name $NAME \
   --worker-connections 1000 \
   --workers $NUM_WORKERS \
   --user $USER \
   --group $GROUP \
   --log-level $LOG_LEVEL