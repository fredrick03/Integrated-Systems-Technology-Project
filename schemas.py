from pydantic import BaseModel, EmailStr

class MenuItems(BaseModel):
    menu_id : int
    restaurant_id : int
    dish_name : str
    price_rupiah : float

class Restaurants(BaseModel):
    restaurant_id : int
    restaurant_name : str
    university : str        #e.g Institut Teknnologi Bandung
    detail_location : str   #e.g Kantin LabTek 5
    distance_m : int        #distance from university center point
    rating : float

class Users(BaseModel):
    user_id : int
    username : str
    email :EmailStr
    password : str
    name : str
    university : str
    phone_number : str