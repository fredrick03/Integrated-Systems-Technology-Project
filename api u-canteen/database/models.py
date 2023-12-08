from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey, Boolean, NUMERIC
from sqlalchemy.orm import relationship
from database.database import Base

class Restaurants(Base):
    __tablename__ = "restaurants"
    restaurant_id = Column(Integer, primary_key=True, autoincrement=True)
    restaurant_name = Column(String(255), nullable=False)
    university_name = Column(String(255), ForeignKey("university.university_name"))
    lat = Column(NUMERIC(18,15), nullable=False)
    long = Column(NUMERIC(18,15), nullable=True)
    detail_location = Column(String(255), nullable=True)
    distance_m = Column(Integer, nullable=False)
    rating = Column(DECIMAL(3, 2), nullable=True)

    university = relationship("University")

class MenuItem(Base):
    __tablename__ = "menu_items"
    menu_id = Column(Integer, primary_key=True, autoincrement=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.restaurant_id"))
    dish_name = Column(String(255), nullable=False)
    price_rupiah = Column(DECIMAL(10, 2), nullable=False)
    
    restaurant = relationship("Restaurants")

class Users(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    university_name = Column(String(255), nullable=True)
    phone_number = Column(String(20), nullable=False)
    is_admin = Column(Boolean, nullable=False, server_default="0")
    access_token = Column(String(255), nullable=True)
    token_type = Column(String(255), nullable=True)

class University(Base):
    __tablename__ = "university"
    university_name = Column(String(255), primary_key=True)
    lat = Column(NUMERIC(18,15), nullable=False)
    long = Column(NUMERIC(18,15), nullable=True)


