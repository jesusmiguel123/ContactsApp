from sqlalchemy import Column, Integer, String, Identity, ForeignKey
from sqlalchemy.orm import relationship

from flask_login import UserMixin

from .db import Base
from . import login_manager

class Contact(Base):
   __tablename__ = 'contacts'
   id = Column(Integer,  Identity(start=1), primary_key=True)
   username = Column(String(25), ForeignKey("profiles.username", ondelete="CASCADE"), nullable=False)
   contact_username = Column(String(25), ForeignKey("profiles.username", ondelete="CASCADE"), nullable=False)
   contact = relationship("Profile",
                          back_populates="contacts",
                          foreign_keys=[username])

   def __init__(self, username, contact_username):
      self.username = username
      self.contact_username = contact_username

class Profile(Base):
   __tablename__ = 'profiles'
   name = Column(String(32), nullable=False)
   lastname = Column(String(40), nullable=False)
   username = Column(String(25), ForeignKey("users.username"), unique=True, nullable=False, primary_key=True)
   email = Column(String(40), unique=True, nullable=False)
   profile_image_url = Column(String(60), unique=True, nullable=False)
   contacts = relationship("Contact",
                           back_populates="contact",
                           cascade="all, delete-orphan",
                           primaryjoin=(username == Contact.username))

   def __init__(self, name, lastname, username, email, profile_image_url):
      self.name = name
      self.lastname = lastname
      self.username = username
      self.email = email
      self.profile_image_url = profile_image_url

   def __repr__(self):
      return f"<Profile {self.username!r}>"

class User(Base, UserMixin):
   __tablename__ = 'users'
   id = Column(Integer,  Identity(start=1), primary_key=True)
   username = Column(String(25), unique=True, nullable=False, primary_key=True)
   password = Column(String(150), nullable=False)

   def __init__(self, username, password):
      self.username = username
      self.password = password

   def __repr__(self):
      return f"<User {self.username!r}>"

class Admin(Base, UserMixin):
   __tablename__ = 'admins'
   id = Column(Integer,  Identity(start=1), primary_key=True)
   username = Column(String(25), unique=True, nullable=False, primary_key=True)
   password = Column(String(150), nullable=False)

   def __init__(self, username, password):
      self.username = username
      self.password = password

   def __repr__(self):
      return f"<Admin {self.username!r}>"

@login_manager.user_loader
def load_user(id):
   return Admin.query.filter(Admin.id == id).first()

@login_manager.request_loader
def load_user_from_request(request):
   username = request.view_args.get("username")
   return User.query.filter(User.username == username).first()