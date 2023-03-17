#!bin/sh

flask check-db
flask init-db
flask run --host 0.0.0.0 --debug