#!bin/sh

flask check-db
flask init-db
flask initial-admin
flask run --host 0.0.0.0 --debug