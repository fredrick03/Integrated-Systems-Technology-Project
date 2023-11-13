from fastapi import HTTPException, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import Restaurants, RestaurantsOut
from database.database import get_db
from database import models
from middleware import oauth
import haversine as hs
from haversine import Unit
from shapely.geometry import Point

restaurants_router = APIRouter(tags=['Restaurant Route'])

# Get all restaurants - admin only
@restaurants_router.get("/admin/restaurants/all", response_model=List[RestaurantsOut])
async def retrieve_all_resto(db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        list_restaurants = db.query(models.Restaurants).all()
        return list_restaurants


# Get restaurant by ID - admin only
@restaurants_router.get("/admin/restaurants/{restaurant_id}", response_model=RestaurantsOut)
async def retrieve_resto_by_id(restaurant_id: int, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        restaurant = db.query(models.Restaurants).filter(models.Restaurants.restaurant_id == restaurant_id).first()
        if restaurant is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Restaurant with supplied ID not found"
            )
        return restaurant


# Get restaurants by university - admin only
@restaurants_router.get("/restaurants/uni/{university}", response_model=List[RestaurantsOut])
async def retrieve_resto_by_university(university_name: str, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        restaurants = db.query(models.Restaurants).filter(models.Restaurants.university_name == university_name).all()
        if not restaurants:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No restaurants found in '{university_name}.'"
            )
        return restaurants

# Get nearby restaurants - all users
@restaurants_router.get("/users/restaurants/nearby", response_model=List[RestaurantsOut])
async def retrieve_nearby_resto(db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    list_restaurants = db.query(models.Restaurants).filter(models.Restaurants.university_name == current_user.university_name).all()
    return list_restaurants

# Get restaurants by name - all users without login
@restaurants_router.get("/users/restaurants/name/{restaurant_name}", response_model=List[RestaurantsOut])
async def retrieve_resto_by_name(restaurant_name: str, db: Session = Depends(get_db)):
    restaurants = db.query(models.Restaurants).filter(models.Restaurants.restaurant_name == restaurant_name).all()
    if not restaurants:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant '{restaurant_name}' not found."
        )
    return restaurants

# Add new restaurant - admin only
@restaurants_router.post('/admin/restaurants', response_model=RestaurantsOut)
async def add_resto(item: Restaurants, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        restaurant = models.Restaurants(**item.dict())
        university = db.query(models.University).filter(models.University.university_name == restaurant.university_name).first()
        restaurant_loc = Point(restaurant.lat,restaurant.long)
        university_loc = Point(university.lat,university.long)
        distance_m = hs.haversine(university_loc,restaurant_loc, unit=Unit.METERS)
        if distance_m > 500:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No restaurants with distance over 500m from {restaurant.university} are allowed."
            )
        else:
            restaurant.distance_m = distance_m
            db.add(restaurant)
            db.commit()

            # Retrieve all remaining menu items
            remaining_restaurants = db.query(models.Restaurants).all()

            # Reorder the menu IDs
            for index, item in enumerate(remaining_restaurants, start=1):
                item.restaurant_id = index

            # Commit the changes to the database
            db.commit()
            return restaurant

# Update restaurant by ID - admin only
@restaurants_router.put('/admin/restaurants/{restaurant_id}')
async def update_resto(restaurant_id: int, item: Restaurants, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        restaurant = models.Restaurants(**item.dict())
        if restaurant is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Restaurant with ID {restaurant_id} is not found."
            )
        else: 
            # get university and check restaurant distance from university
            university = db.query(models.University).filter(models.University.university_name == restaurant.university_name).first()
            restaurant_loc = Point(restaurant.lat,restaurant.long)
            university_loc = Point(university.lat,university.long)
            distance = hs.haversine(university_loc,restaurant_loc, unit=Unit.METERS)
            # condition for distance
            if distance > 500:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No restaurants with distance over 500m from {restaurant.university} are allowed."
                )
            else:
                for key, value in item.dict().items():
                    setattr(restaurant, key, value)

                db.commit()
                # Retrieve all remaining menu items
                remaining_restaurants = db.query(models.Restaurants).all()

                # Reorder the restaurant IDs
                for index, item in enumerate(remaining_restaurants, start=1):
                    item.restaurant_id = index

                # Commit the changes to the database
                db.commit()
                return "Restaurant updated successfully."

# Delete restaurant by ID - admin only
@restaurants_router.delete('/admin/restaurants/{restaurant_id}')
async def delete_resto(restaurant_id: int, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        restaurant = db.query(models.Restaurants).filter(models.Restaurants.restaurant_id == restaurant_id).first()
        if restaurant is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Restaurant with ID {restaurant_id} is not found."
            )
        else:
            db.delete(restaurant)
            db.commit()

            # Retrieve all remaining menu items
            remaining_restaurants = db.query(models.Restaurants).all()

            # Reorder the menu IDs
            for index, item in enumerate(remaining_restaurants, start=1):
                item.restaurant_id = index

            # Commit the changes to the database
            db.commit()
            return "Restaurant deleted successfully."
