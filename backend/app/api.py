from flask import Blueprint, request, render_template, \
   url_for, redirect, jsonify
import json

bp = Blueprint("api", __name__, url_prefix="/api/v1")

@bp.post("/login")
def login():
   print(request.data)
   response = {
      "body": "De mono"
   }
   return jsonify(response), 400