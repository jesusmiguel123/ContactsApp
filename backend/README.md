The backend was build with following Python Libraries:
- `Flask==2.2.3`
- `python-dotenv==1.0.0`
- `flask-cors==3.0.10`
- `flask-login==0.6.2`
- `flask_wtf==1.1.1`
- `psycopg2==2.9.5`
- `SQLAlchemy==2.0.6`

And to deploy:
- `gunicorn==20.1.0`

It provides an administration side on `/admin` route.

The profile images are stored in `static/img` route.