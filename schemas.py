from pydantic import BaseModel, EmailStr
from typing import Optional

class MenuItemsOut(BaseModel):
    menu_id : int
    restaurant_id : int
    dish_name : str
    price_rupiah : float

class MenuItems(BaseModel):
    restaurant_id : int
    dish_name : str
    price_rupiah : float

class RestaurantsOut(BaseModel):
    restaurant_id : int
    restaurant_name : str
    university : str        #e.g Institut Teknnologi Bandung
    detail_location : str   #e.g Kantin LabTek 5
    distance_m : int        #distance from university center point
    rating : float

class Restaurants(BaseModel):
    restaurant_name : str
    university : str        #e.g Institut Teknnologi Bandung
    detail_location : str   #e.g Kantin LabTek 5
    distance_m : int        #distance from university center point
    rating : float

class UsersOut(BaseModel):
    user_id : int
    username : str
    email :EmailStr
    password : str
    name : str
    university : str
    phone_number : str

class Users(BaseModel):
    username : str
    email :EmailStr
    password : str
    name : str
    university : str
    phone_number : str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None 
