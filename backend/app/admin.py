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
from werkzeug.utils import secure_filename

import os
from pathlib import Path

from .db import db_session
from .models import (
   Admin,
   User,
   Profile,
   Contact
)

BASE_DIR = Path(__file__).resolve().parent

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

@bp.get("/get-users")
@login_required
def get_users():
   users = User.query.order_by(User.username).all()
   users_list = []
   for user in users:
      users_list.append(user.username)
   return jsonify({
      "users": users_list
   })

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

@bp.post("/add-profile")
@login_required
def add_profile():
   try:
      name = request.form.get("name")
      lastname = request.form.get("lastname")
      username = request.form.get("username")
      password = request.form.get("password")
      email = request.form.get("email")
      if "file" not in request.files:
         return jsonify({
            "body": "No file part"
         }), 400
      file = request.files["file"]
      if not (name.strip() 
              and lastname.strip()
              and username.strip()
              and password.strip()
              and email.strip()):
         return jsonify({
            "body": "Void fields"
         }), 400
      if len(password) < 8:
         return jsonify({
            "body": "Password lenght < 8!"
         }), 400
      if (file.filename.rsplit(".", 1)[1].lower() not in {"jpg", "jpeg", "png"}
          or "." not in file.filename):
         return jsonify({
            "body": "File type not supported!"
         }), 400
      user = User.query.filter(User.username == username).first()
      if user != None:
         return jsonify({
            "body": f"Username {username} already exists!"
         }), 400
      profile = Profile.query.filter(Profile.email == email).first()
      if profile != None:
         return jsonify({
            "body": f"Email {email} already exists!"
         }), 400
      file_bytes = file.read()
      filename = secure_filename(file.filename)
      with open(BASE_DIR / "static/img" / filename, "wb") as f:
         f.write(file_bytes)
      profile_image_url = f"static/img/{file.filename}"
      password_hashed = generate_password_hash(password)
      new_user = User(username, password_hashed)
      new_profile = Profile(name, lastname, username, email, profile_image_url)
      db_session.add(new_user)
      db_session.commit()
      db_session.add(new_profile)
      db_session.commit()
      return jsonify({
         "body": url_for('admin.profiles')
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error!"
      }), 400

@bp.put("/edit-profile")
@login_required
def edit_profile():
   try:
      username = request.args.get("username")
      if username == None:
         return jsonify({
            "body": "Username missed!"
         }), 400
      name = request.form.get("name")
      lastname = request.form.get("lastname")
      new_username = request.form.get("username")
      password = request.form.get("password")
      email = request.form.get("email")
      photo = True
      if "file" not in request.files:
         photo = False
      if not (name.strip() 
              and lastname.strip()
              and new_username.strip()
              and password.strip()
              and email.strip()):
         return jsonify({
            "body": "Void fields"
         }), 400
      user = User.query.filter(User.username == username).first()
      if user == None:
         return jsonify({
            "body": "User not found!"
         }), 400
      if len(password) < 8:
         return jsonify({
            "body": "New password lenght < 8!"
         }), 400
      profile = Profile.query.filter(Profile.username == username).first()
      if name != profile.name:
         profile.name = name
      if lastname != profile.lastname:
         profile.lastname = lastname
      if email != profile.email:
         profile_check = Profile.query.filter(Profile.email == email).first()
         if profile_check != None:
            return jsonify({
               "body": f"Email {email} already exists!"
            }), 400
         profile.email = email
      if new_username != username:
         user_check = User.query.filter(User.username == new_username).first()
         if user_check != None:
            return jsonify({
               "body": f"Username {new_username} already exists!"
            }), 400
      if photo:
         file = request.files["file"]
         if (file.filename.rsplit(".", 1)[1].lower() not in {"jpg", "jpeg", "png"}
            or "." not in file.filename):
            return jsonify({
               "body": "File type not supported!"
            }), 400
         file_bytes = file.read()
         filename = secure_filename(file.filename)
         if new_username != username:
            os.remove(BASE_DIR / "static/img" / filename)
            filename_split = filename.split("_profile_photo")
            filename_split[0] = new_username
            filename = "_profile_photo".join(filename_split)
         with open(BASE_DIR / "static/img" / filename, "wb") as f:
            f.write(file_bytes)
         profile_image_url = f"static/img/{filename}"
         profile.profile_image_url = profile_image_url
      else:
         if new_username != username:
            profile_image_url = f"static/img/{new_username}_profile_photo"
            os.rename(
               BASE_DIR / profile.profile_image_url,
               BASE_DIR / profile_image_url
            )
            profile.profile_image_url = profile_image_url
      password_hashed = generate_password_hash(password)
      user.password = password_hashed
      if new_username != username:
         db_session.commit()
         new_user = User(
            new_username,
            user.password
         )
         db_session.add(new_user)
         db_session.commit()
         new_profile = Profile(
            profile.name,
            profile.lastname,
            new_username,
            "my_email",
            "my_profile_image_url"
         )
         db_session.add(new_profile)
         db_session.commit()
         contacts = Contact.query.filter(Contact.username == username).all()
         for contact in contacts:
            contact.username = new_username
         contactsOf = Contact.query.filter(Contact.contact_username == username).all()
         for contact in contactsOf:
            contact.contact_username = new_username
         db_session.commit()
         new_profile_email = profile.email
         new_profile_image_url = profile.profile_image_url
         db_session.delete(profile)
         db_session.commit()
         db_session.delete(user)
         db_session.commit()
         new_profile.email = new_profile_email
         new_profile.profile_image_url = new_profile_image_url
      db_session.commit()
      return jsonify({
         "body": "Profile edited successfully!"
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400

@bp.delete("/delete-profile")
@login_required
def delete_profile():
   try:
      username = request.args.get("username")
      if username == None:
         return jsonify({
            "body": "Username missed!"
         }), 400
      profile = Profile.query.filter(Profile.username == username).first()
      if profile == None:
         return jsonify({
            "body": f"Profile with username {username} not found!"
         }), 400
      
      contacts = Contact.query.filter(Contact.username == username).all()
      for contact in contacts:
         db_session.delete(contact)
      contactsOf = Contact.query.filter(Contact.contact_username == username).all()
      for contact in contactsOf:
         db_session.delete(contact)
      db_session.commit()
      
      filename = profile.profile_image_url
      os.remove(BASE_DIR / filename)
      db_session.delete(profile)
      
      user = User.query.filter(User.username == username).first()
      db_session.delete(user)
      db_session.commit()
      return jsonify({
         "body": "Profile deleted successfully!"
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error!"
      }), 400

@bp.get("/contacts")
@login_required
def contacts():
   contacts = Contact.query.order_by(Contact.username).all()
   contacts_list = []
   for contact in contacts:
      contacts_list.append({
         "id": contact.id,
         "user": contact.username,
         "contact": contact.contact_username
      })
   return render_template(
      "Admin/contacts.html",
      contacts=contacts_list
   )

@bp.post("/add-contact")
@login_required
def add_contact():
   try:
      username = request.form.get("username")
      contact = request.form.get("contact")
      if not (username.strip()
              and contact.strip()):
         return jsonify({
            "body": "Void fields"
         }), 400
      if username == contact:
         return jsonify({
            "body": "You can't connect a user with itself!"
         }), 400
      if User.query.filter(User.username == username).first() == None:
         return jsonify({
            "body": f"User {username} not found!"
         }), 400
      if User.query.filter(User.username == contact).first() == None:
         return jsonify({
            "body": f"User {contact} not found!"
         }), 400
      username_contact = Contact.query.filter(
         Contact.username == username,
         Contact.contact_username == contact
      ).first()
      if username_contact != None:
         return jsonify({
            "body": f"Connection already exists!"
         }), 400
      new_contact = Contact(username, contact)
      db_session.add(new_contact)
      db_session.commit()
      return jsonify({
         "body": url_for('admin.contacts')
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error!"
      }), 400

@bp.put("/edit-contact")
@login_required
def edit_contact():
   try:
      id = request.args.get("id")
      if id == None:
         return jsonify({
            "body": "ID missed!"
         }), 400
      contact_username = request.form.get("contact")
      if not contact_username.strip():
         return jsonify({
            "body": "Void fields"
         }), 400
      if User.query.filter(User.username == contact_username).first() == None:
         return jsonify({
            "body": f"User {contact_username} not found!"
         }), 400
      contact = Contact.query.filter(Contact.id == id).first()
      if contact == None:
         return jsonify({
            "body": f"Contact with ID {id} not found!"
         }), 400
      username_contact = Contact.query.filter(
         Contact.username == contact.username,
         Contact.contact_username == contact_username
      ).first()
      if username_contact != None:
         return jsonify({
            "body": f"Connection already exists!"
         }), 400
      contact.contact_username = contact_username
      db_session.commit()
      return jsonify({
         "body": "Contact edited successfully!"
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error!"
      }), 400

@bp.delete("/delete-contact")
@login_required
def delete_contact():
   try:
      id = request.args.get("id")
      if id == None:
         return jsonify({
            "body": "ID missed!"
         }), 400
      contact = Contact.query.filter(Contact.id == id).first()
      if contact == None:
         return jsonify({
            "body": f"Contact with ID {id} not found!"
         }), 400
      db_session.delete(contact)
      db_session.commit()
      return jsonify({
         "body": "Contact deleted successfully!"
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error!"
      }), 400

@bp.get("/admins")
@login_required
def admins():
   admins = Admin.query.order_by(Admin.username).all()
   admins_list = []
   for admin in admins:
      admins_list.append({
         "id": admin.id,
         "username": admin.username
      })
   return render_template(
      "Admin/admins.html",
      admins=admins_list
   )

@bp.post("/add-admin")
@login_required
def add_admin():
   try:
      username = request.form.get("username")
      password = request.form.get("password")
      if not (username.strip()
              and password.strip()):
         return jsonify({
            "body": "Void fields"
         }), 400
      if len(password) < 8:
         return jsonify({
            "body": "Password lenght < 8!"
         }), 400
      if Admin.query.filter(Admin.username == username).first() != None:
         return jsonify({
            "body": f"Username {username} already exists!"
         }), 400
      password_hashed = generate_password_hash(password)
      new_admin = Admin(username, password_hashed)
      db_session.add(new_admin)
      db_session.commit()
      return jsonify({
         "body": url_for('admin.admins')
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error!"
      }), 400

@bp.put("/edit-admin")
@login_required
def edit_admin():
   try:
      user = request.args.get("user")
      if user == None:
         return jsonify({
            "body": "User missed!"
         }), 400
      new_username = request.form.get("username")
      password = request.form.get("password")
      if not (username.strip()
              and password.strip()):
         return jsonify({
            "body": "Void fields"
         }), 400
      admin = Admin.query.filter(Admin.username == user).first()
      if admin == None:
         return jsonify({
            "body": f"Admin with username {user} not found!"
         }), 400
      if len(password) < 8:
         return jsonify({
            "body": "Password lenght < 8!"
         }), 400
      if user != new_username:
         if Admin.query.filter(Admin.username == new_username).first() != None:
            return jsonify({
               "body": f"Username {new_username} already exists!"
            }), 400
         admin.username = new_username
      password_hashed = generate_password_hash(password)
      admin.password = password_hashed
      db_session.commit()
      return jsonify({
         "body": "Admin edited successfully!"
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error!"
      }), 400

@bp.delete("/delete-admin")
@login_required
def delete_admin():
   try:
      id = request.args.get("id")
      if id == None:
         return jsonify({
            "body": "ID missed!"
         }), 400
      admin = Admin.query.filter(Admin.id == id).first()
      if admin == None:
         return jsonify({
            "body": f"Admin with ID {id} not found!"
         }), 400
      db_session.delete(admin)
      db_session.commit()
      return jsonify({
         "body": "Admin deleted successfully!"
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error!"
      }), 400

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