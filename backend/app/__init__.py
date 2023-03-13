from flask import Flask
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager

from dotenv import load_dotenv
import os

load_dotenv("../.env")

app = Flask(__name__)

login_manager = LoginManager(app)
login_manager.init_app(app)
login_manager.session_protection = "strong"

app.config.update(
   SECRET_KEY=os.getenv("SECRET_KEY"),
   SESSION_COOKIE_HTTPONLY=True,
   REMEMBER_COOKIE_HTTPONLY=True,
   SESSION_COOKIE_SAMESITE="None",
   SESSION_COOKIE_SECURE=True
)
csrf = CSRFProtect(app)
cors = CORS(
   app,
   resources={r"/api/v1/*": {"origins": "*"}},
   expose_headers=["Content-Type", "X-CSRFToken"],
   supports_credentials=True
)

@app.get("/")
def index():
   return "<h1>Contacts Web Application</h1>"

from . import db

db.init_app(app)

from . import api
from . import admin

admin.init_app(app)

app.register_blueprint(api.bp)
app.register_blueprint(admin.bp)
app.add_url_rule("/", endpoint="index")