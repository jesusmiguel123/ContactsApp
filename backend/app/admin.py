from flask import Blueprint
from flask import render_template
from flask import request

from click import command
from click import echo

from werkzeug.security import generate_password_hash

from .db import db_session
from .models import Admin

bp = Blueprint("admin", __name__, url_prefix="/admin")

@bp.get("/")
def index():
   return render_template("home.html")

@bp.route("/login", methods=["GET", "POST"])
def login():
   if request.method == "POST":
      print(request.form)
   return render_template("login.html")

@command("initial-admin")
def initial_admin_command():
   """Create initial admin user."""
   if Admin.query.first() == None:
      admin = Admin("admin", generate_password_hash("asdf1234"))
      db_session.add(admin)
      db_session.commit()
      echo("Initialized admin user.")
   else:
      echo("Admin user already exists.")

def init_app(app):
   """Register database functions with the Flask app. This is called by
   the application factory.
   """
   app.cli.add_command(initial_admin_command)