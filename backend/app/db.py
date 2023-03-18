from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from click import command, echo

from dotenv import load_dotenv
import os
import socket
import time

load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")
POSTGRES_DB = os.getenv("POSTGRES_DB")

str_connection = f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_engine(str_connection)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
   from . import models
   Base.metadata.create_all(bind=engine, checkfirst=True)

def check_db():
   while True:
      sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      result = sock.connect_ex((POSTGRES_HOST, int(POSTGRES_PORT)))
      if result == 0:
         return "Database connected!"
      else:
         echo("Database is not connected yet...")
         time.sleep(3)

def close_db(exceptions=None):
   db_session.remove()

@command("init-db")
def init_db_command():
   """Clear existing data and create new tables."""
   init_db()
   echo("Initialized the database.")

@command("check-db")
def check_db_command():
   """Check database connection."""
   echo("Database connecting...")
   echo(check_db())

def init_app(app):
   """Register database functions with the Flask app. This is called by
   the application factory.
   """
   app.teardown_appcontext(close_db)
   app.cli.add_command(init_db_command)
   app.cli.add_command(check_db_command)