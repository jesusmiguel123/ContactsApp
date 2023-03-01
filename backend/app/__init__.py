from flask import Flask
from flask_cors import CORS

def create_app(test_config=None):
   """Create and configure an instance of the Flask application."""
   app = Flask(__name__)
   cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})

   @app.get("/")
   def index():
      return "<h1>API for Web Application</h1>"

   from . import db

   db.init_app(app)

   from . import api

   app.register_blueprint(api.bp)
   app.add_url_rule("/", endpoint="index")

   return app