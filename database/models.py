from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base

class Restaurants(Base):
    __tablename__ = "restaurants"
    restaurant_id = Column(Integer, primary_key=True, autoincrement=True)
    restaurant_name = Column(String(255), nullable=False)
    university = Column(String(255), nullable=False)
    detail_location = Column(String(255), nullable=True)
    distance_m = Column(Integer, nullable=False)
    rating = Column(DECIMAL(3, 2), nullable=True)
    
    # Establishing the relationship between Restaurant and MenuItem
    menu_items = relationship("MenuItem", back_populates="restaurant")

class MenuItem(Base):
    __tablename__ = "menu_items"
    menu_id = Column(Integer, primary_key=True, autoincrement=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.restaurant_id"))
    dish_name = Column(String(255), nullable=False)
    price_rupiah = Column(DECIMAL(10, 2), nullable=False)
    
    # Establishing the relationship between MenuItem and Restaurants
    restaurant = relationship("Restaurants", back_populates="menu_items")


class Users(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), nullable=True, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)
    university = Column(String(255), nullable=True)
    phone_number = Column(String(20), nullable=True)
