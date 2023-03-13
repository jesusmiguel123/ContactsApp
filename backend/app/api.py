from flask import Blueprint
from flask import request
from flask import render_template
from flask import url_for
from flask import redirect
from flask import jsonify
from flask import send_from_directory

from flask_wtf.csrf import generate_csrf

from flask_login import login_user
from flask_login import logout_user
from flask_login import login_required
from flask_login import current_user

from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename

import os
import json
from pathlib import Path
from functools import wraps

from .db import db_session
from .models import User
from .models import Profile
from .models import Contact

BASE_DIR = Path(__file__).resolve().parent

bp = Blueprint("api", __name__, url_prefix="/api/v1")

def check_user(view):
   @wraps(view)
   def new_view(*args, **kwargs):
      if current_user.username != kwargs["username"]:
         return jsonify({
            "body": "You must be authenticated!"
         }), 401
      return view(*args, **kwargs)
   return new_view

@bp.get("/get_csrf_token")
def get_csrf_token():
   token = generate_csrf()
   response = jsonify({
      "body": "CSRF Cookie Set"
   })
   response.headers.set("X-CSRFToken", token)
   response.set_cookie("csrftoken", token, secure=True, httponly=True, samesite="None")
   return response

@bp.get("/")
def api_index():
   return "<h1>API for Contacts App</h1>"

@bp.post("/login")
def login():
   try:
      data = json.loads(request.data)
      if not (data["username"].strip() and data["password"].strip()):
         return jsonify({
            "body": "Void fields"
         }), 400
      username = data["username"].strip()
      password = data["password"].strip()
      user = User.query.filter(User.username == username).first()
      if user == None or not check_password_hash(user.password, password):
         return jsonify({
            "body": "Username or password incorrect!"
         }), 400
      login_user(user)
      return jsonify({
         "body": "Login successfully!"
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400

@bp.get("/logout/<username>")
@login_required
def logout(username):
   logout_user()
   return jsonify({
      "body": "User Logout"
   })

@bp.post("/register")
def register():
   try:
      name = request.form.get("name")
      lastname = request.form.get("lastname")
      username = request.form.get("username")
      password = request.form.get("password")
      repassword = request.form.get("repassword")
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
              and repassword.strip()
              and email.strip()):
         return jsonify({
            "body": "Void fields"
         }), 400
      if password != repassword:
         return jsonify({
            "body": "Repassword is not equal to password!"
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
         "body": "New User registered successfully!"
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400

@bp.get("/profile/<username>")
def profile(username):
   try:
      profile = Profile.query.filter(Profile.username == username).first()
      if profile == None:
         return jsonify({
            "body": f"Profile not found"
         }), 400
      data = {
         "name": profile.name,
         "lastname": profile.lastname,
         "email": profile.email
      }
      return jsonify({
         "body": data
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400

@bp.get("/profile/photo/<username>")
def profile_photo(username):
   try:
      profile = Profile.query.filter(Profile.username == username).first()
      if profile == None:
         return jsonify({
            "body": f"Profile not found"
         }), 400
      filename = profile.profile_image_url.split("/")[-1]
      return send_from_directory(BASE_DIR / "static/img", filename)
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400

@bp.post("/edit-profile/<username>")
@login_required
@check_user
def edit_profile(username):
   try:
      name = request.form.get("name")
      lastname = request.form.get("lastname")
      newUsername = request.form.get("username")
      oldPassword = request.form.get("oldPassword")
      newPassword = request.form.get("newPassword")
      email = request.form.get("email")
      if "file" not in request.files:
         return jsonify({
            "body": "No file part"
         }), 400
      file = request.files["file"]
      if not (name.strip() 
              and lastname.strip()
              and username.strip()
              and oldPassword.strip()
              and newPassword.strip()
              and email.strip()):
         return jsonify({
            "body": "Void fields"
         }), 400
      user = User.query.filter(User.username == username).first()
      if user == None:
         return jsonify({
            "body": "User not found!"
         }), 400
      if not check_password_hash(user.password, oldPassword):
         return jsonify({
            "body": "Old password incorrect!"
         }), 400
      if len(newPassword) < 8:
         return jsonify({
            "body": "New password lenght < 8!"
         }), 400
      if (file.filename.rsplit(".", 1)[1].lower() not in {"jpg", "jpeg", "png"}
          or "." not in file.filename):
         return jsonify({
            "body": "File type not supported!"
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
      file_bytes = file.read()
      filename = secure_filename(file.filename)
      if newUsername != username:
         user_check = User.query.filter(User.username == newUsername).first()
         if user_check != None:
            return jsonify({
               "body": f"Username {newUsername} already exists!"
            }), 400
         os.remove(BASE_DIR / "static/img" / filename)
         filename_split = filename.split("_profile_photo")
         filename_split[0] = newUsername
         filename = "_profile_photo".join(filename_split)
      with open(BASE_DIR / "static/img" / filename, "wb") as f:
         f.write(file_bytes)
      profile_image_url = f"static/img/{filename}"
      profile.profile_image_url = profile_image_url
      if newPassword != oldPassword:
         password_hashed = generate_password_hash(newPassword)
         user.password = password_hashed
      if newUsername != username:
         db_session.commit()
         new_user = User(
            newUsername,
            user.password
         )
         db_session.add(new_user)
         db_session.commit()
         new_profile = Profile(
            profile.name,
            profile.lastname,
            newUsername,
            "my_email",
            "my_profile_image_url"
         )
         db_session.add(new_profile)
         db_session.commit()
         contacts = Contact.query.filter(Contact.username == username).all()
         for contact in contacts:
            contact.username = newUsername
         contactsOf = Contact.query.filter(Contact.contact_username == username).all()
         for contact in contactsOf:
            contact.contact_username = newUsername
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

@bp.get("/profiles/<username>")
@login_required
@check_user
def profiles(username):
   try:
      profile_user = Profile.query.filter(Profile.username == username).first()
      if profile_user == None:
         return jsonify({
            "body": f"Profile not found"
         }), 400
      profiles = Profile.query.with_entities(Profile.username).all()
      if profiles == None:
         return jsonify({
            "body": f"Any profile found"
         }), 400
      data = []
      list_contacts = []
      contacts = Contact.query.filter(Contact.username == username).with_entities(Contact.contact_username).all()
      if contacts != None:
         list_contacts = [contact[0] for contact in contacts]
      list_contacts = list_contacts + [username]
      for profile in profiles:
         if profile[0] not in list_contacts:
            data.append({
               "username": profile[0]
            })
      if len(data) == 0:
         return jsonify({
            "body": "No users to connect found!"
         }), 400
      return jsonify({
         "usernames": data
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400

@bp.get("/get-contacts/<username>")
@login_required
@check_user
def get_contacts(username):
   try:
      profile_user = Profile.query.filter(Profile.username == username).first()
      if profile_user == None:
         return jsonify({
            "body": f"User profile not found"
         }), 400
      list_contacts = []
      contacts = Contact.query.filter(Contact.username == username).with_entities(Contact.contact_username).all()
      if contacts != None:
         list_contacts = [contact[0] for contact in contacts]
      if len(list_contacts) == 0:
         return jsonify({
            "body": "No contacts found!"
         }), 400
      data = []
      for contact in list_contacts:
         profile_contact = Profile.query.filter(Profile.username == contact).first()
         data.append({
            "name": profile_contact.username,
            "email": profile_contact.email
         })
      return jsonify({
         "contacts": data
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400

@bp.post("/add-contact/<username>")
@login_required
@check_user
def add_contact(username):
   try:
      contact = request.form.get("contact")
      if not contact.strip():
         return jsonify({
            "body": f"Contact username is empty"
         }), 400
      profile_user = Profile.query.filter(Profile.username == username).first()
      if profile_user == None:
         return jsonify({
            "body": f"User profile not found"
         }), 400
      profile_contact = Profile.query.filter(Profile.username == contact).first()
      if profile_contact == None:
         return jsonify({
            "body": f"Contact profile not found"
         }), 400
      new_contact = Contact(profile_user.username, profile_contact.username)
      db_session.add(new_contact)
      db_session.commit()
      return jsonify({
         "body": "Successfully added!"
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400

@bp.get("/delete-contact/<username>/<contact_username>")
@login_required
@check_user
def delete_contact(username, contact_username):
   try:
      contact = Contact.query.filter(
         Contact.username == username,
         Contact.contact_username == contact_username
      ).first()
      if contact == None:
         return jsonify({
            "body": f"Connection not found!"
         }), 400
      db_session.delete(contact)
      db_session.commit()
      return jsonify({
         "body": "Successfully removed!"
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400