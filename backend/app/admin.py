from flask import Blueprint
from flask import render_template
from flask import request
from flask import jsonify
from flask import flash
from flask import redirect
from flask import url_for

from flask_login import login_user
from flask_login import login_required
from flask_login import logout_user
from flask_login import current_user

from click import command
from click import echo

from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

from .db import db_session
from .models import Admin

bp = Blueprint("admin", __name__, url_prefix="/admin")

@bp.get("/")
def home():
   return render_template("home.html")

@bp.route("/login", methods=["GET", "POST"])
def login():
   try:
      error = None
      if request.method == "POST":
         while True:
            username = request.form.get("username")
            password = request.form.get("password")
            admin = Admin.query.filter(Admin.username == username).first()
            if not (username.strip() and password.strip()):
               error = "Void fields"
               break
            if admin == None or not check_password_hash(admin.password, password):
               error = "Username or password incorrect!"
               break
            login_user(admin)
            return redirect(url_for("admin.admin_home"))
      return render_template("login.html", error=error)
   except Exception as e:
      print(e)
      return render_template("login.html", error="Server error")

@bp.get("/logout")
@login_required
def logout():
   logout_user()
   return redirect(url_for("admin.login"))

@bp.get("/admin")
@login_required
def admin_home():
   return render_template("admin/home.html")

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