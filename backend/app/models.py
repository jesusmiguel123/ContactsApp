from sqlalchemy import Column, Integer, String, Identity, ForeignKey
from sqlalchemy.orm import relationship
from .db import Base

class Contact(Base):
   __tablename__ = 'contacts'
   id = Column(Integer,  Identity(start=1), primary_key=True)
   username = Column(String(25), ForeignKey("users.username", ondelete="CASCADE"), nullable=False)
   contact_username = Column(String(25), ForeignKey("users.username", ondelete="CASCADE"), nullable=False)
   contact = relationship("User",
                          back_populates="contacts",
                          foreign_keys=[username])

   def __init__(self, username, contact_username):
      self.username = username
      self.contact_username = contact_username

class User(Base):
   __tablename__ = 'users'
   id = Column(Integer,  Identity(start=1), primary_key=True)
   name = Column(String(32), nullable=False)
   lastname = Column(String(40), nullable=False)
   username = Column(String(25), unique=True, nullable=False, primary_key=True)
   password = Column(String(150), nullable=False)
   email = Column(String(40), unique=True, nullable=False)
   profile_image_url = Column(String(60), unique=True, nullable=False)
   contacts = relationship("Contact",
                           back_populates="contact",
                           cascade="all, delete-orphan",
                           primaryjoin=(username == Contact.username))

   def __init__(self, name, lastname, username, password, email, profile_image_url):
      self.name = name
      self.lastname = lastname
      self.username = username
      self.password = password
      self.email = email
      self.profile_image_url = profile_image_url

   def __repr__(self):
      return f"<User {self.username!r}>"