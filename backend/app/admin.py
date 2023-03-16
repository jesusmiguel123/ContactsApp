from flask import (
   Blueprint,
   render_template,
   request,
   jsonify,
   flash,
   redirect,
   url_for
)

from flask_login import (
   login_user,
   login_required,
   logout_user,
   current_user
)

from click import command, echo

from werkzeug.security import (
   generate_password_hash,
   check_password_hash
)

from .db import db_session
from .models import (
   Admin,
   User,
   Profile,
   Contact
)

bp = Blueprint("admin", __name__, url_prefix="/admin")

@bp.get("/")
def home():
   return render_template("home.html")

@bp.route("/login", methods=["GET", "POST"])
def login():
   try:
      if request.method == "POST":
         username = request.form.get("username")
         password = request.form.get("password")
         admin = Admin.query.filter(Admin.username == username).first()
         if not (username.strip() and password.strip()):
            return render_template("login.html", error="Void fields")
         if admin == None or not check_password_hash(admin.password, password):
            return render_template("login.html", error="Username or password incorrect!")
         login_user(admin)
         return redirect(url_for("admin.admin_home"))
      return render_template("login.html")
   except Exception as e:
      print(e)
      return render_template("login.html", error="Server error")

@bp.get("/logout")
@login_required
def logout():
   logout_user()
   return redirect(url_for("admin.login"))

@bp.get("/home")
@login_required
def admin_home():
   return render_template("Admin/home.html")

@bp.get("/users")
@login_required
def users():
   users = User.query.order_by(User.username).all()
   users_list = []
   for user in users:
      users_list.append({
         "username": user.username
      })
   return render_template(
      "Admin/users.html",
      users=users_list
   )

@bp.post("/add-user")
@login_required
def add_user():
   try:
      username = request.form.get("username")
      password = request.form.get("password")
      if User.query.filter(User.username == username).first() != None:
         return jsonify({
            "body": f"Username {username} already exists!"
         }), 400
      password_hashed = generate_password_hash(password)
      new_user = User(username, password_hashed)
      new_profile = Profile("name", "lastname", username, "email", "profile_image_url")
      db_session.add(new_user)
      db_session.commit()
      db_session.add(new_profile)
      db_session.commit()
      return jsonify({
         "body": url_for('admin.users')
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": f"Server error!"
      }), 400

@bp.get("/profiles")
@login_required
def profiles():
   profiles = Profile.query.order_by(Profile.username).all()
   profiles_list = []
   for profile in profiles:
      profiles_list.append({
         "name": profile.name,
         "lastname": profile.lastname,
         "username": profile.username,
         "email": profile.email,
         "profile_photo": profile.profile_image_url
      })
   return render_template(
      "Admin/profiles.html",
      profiles=profiles_list
   )

@bp.get("/contacts")
@login_required
def contacts():
   contacts = Contact.query.order_by(Contact.username).all()
   contacts_list = []
   for contact in contacts:
      contacts_list.append({
         "user": contact.username,
         "contact": contact.contact_username
      })
   return render_template(
      "Admin/contacts.html",
      contacts=contacts_list
   )

@bp.get("/admins")
@login_required
def admins():
   admins = Admin.query.order_by(Admin.username).all()
   admins_list = []
   for admin in admins:
      admins_list.append({
         "username": admin.username
      })
   return render_template(
      "Admin/admins.html",
      admins=admins_list
   )

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
   """Register initial admin with the Flask app. This is called by
   the application factory.
   """
   app.cli.add_command(initial_admin_command)