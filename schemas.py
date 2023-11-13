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
    university_name : str   #e.g Institut Teknologi Bandung
    lat : float
    long : float
    detail_location : str   #e.g Kantin LabTek 5
    distance_m : int        #distance from university center point
    rating : float

class Restaurants(BaseModel):
    restaurant_name : str
    university_name : str   #e.g Institut Teknologi Bandung
    lat : float
    long : float
    detail_location : str   #e.g Kantin LabTek 5
    rating : float

class UsersOut(BaseModel):
    user_id : int
    username : str
    email :EmailStr
    name : str
    university_name : str
    phone_number : str

class Users(BaseModel):
    username : str
    email :EmailStr
    password :str
    name : str
    university_name : str
    phone_number : str
    # is_admin : bool

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None 

class LoginRequest(BaseModel):
    email : EmailStr
    password : str

class LoginResponse(BaseModel):
    username : str
    email :EmailStr
    password : str
    name : str
    university_name : str
    phone_number : str
    access_token : str
    token_type : str

class University(BaseModel):
    university_name : str
    lat : float
    long : float
    
