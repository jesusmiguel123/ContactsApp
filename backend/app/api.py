from flask import Blueprint
from flask import request
from flask import render_template
from flask import url_for
from flask import redirect
from flask import jsonify
from flask import send_from_directory

from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename

import json

from pathlib import Path

from .db import db_session
from .models import User

BASE_DIR = Path(__file__).resolve().parent

bp = Blueprint("api", __name__, url_prefix="/api/v1")

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
      return jsonify({
         "body": "Login successfully!"
      }), 400
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400

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
            "body": "Repassword is required!"
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
      user = User.query.filter(User.email == email).first()
      if user != None:
         return jsonify({
            "body": f"Email {email} already exists!"
         }), 400
      file_bytes = file.read()
      filename = secure_filename(file.filename)
      with open(BASE_DIR / "static/img" / filename, "wb") as f:
         f.write(file_bytes)
      profile_image_url = f"static/img/{file.filename}"
      password_hashed = generate_password_hash(password)
      new_user = User(name, lastname, username, password_hashed, email, profile_image_url)
      db_session.add(new_user)
      db_session.commit()
      return jsonify({
         "body": "New User registered successfully!"
      })
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400