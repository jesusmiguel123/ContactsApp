from flask import Blueprint, request, render_template, \
   url_for, redirect, jsonify
import json

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
   except:
      return jsonify({
         "body": "Server error"
      }), 400