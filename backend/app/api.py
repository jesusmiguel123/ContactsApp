from flask import Blueprint, request, render_template, \
   url_for, redirect, jsonify
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
      print(data["username"].strip(), data["password"])
      return jsonify({
         "body": "Error"
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
      file = request.files["file"]
      if not (name.strip() 
              and lastname.strip()
              and username.strip()
              and password.strip()
              and repassword.strip()
              and email.strip()
              and file):
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
      if file.filename.split(".")[-1] not in ["jpg", "jpeg", "png"]:
         return jsonify({
            "body": "File type not supported!"
         }), 400
      file_bytes = file.read()
      # with open(BASE_DIR / "static/img" / file.filename, "wb") as f:
      #    f.write(file_bytes)
      profile_image_url = f"static/img/{file.filename}"
      new_user = User(name, lastname, username, password, email, profile_image_url)
      db_session.add(new_user)
      db_session.commit()
      return jsonify({
         "body": "New User registered successfully!"
      }), 400
   except Exception as e:
      print(e)
      return jsonify({
         "body": "Server error"
      }), 400