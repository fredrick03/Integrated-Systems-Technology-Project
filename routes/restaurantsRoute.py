from fastapi import HTTPException, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import Restaurants
from database.database import get_db
import database.models as models

restaurants_router = APIRouter()

# Get all restaurants
@restaurants_router.get("/restaurants", response_model=List[Restaurants])
async def retrieve_all_resto(db: Session = Depends(get_db)):
    restaurants = db.query(models.Restaurants).all()
    return restaurants

# Get restaurant by ID
@restaurants_router.get("/restaurants/{restaurant_id}", response_model=Restaurants)
async def retrieve_resto_by_id(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(models.Restaurants).filter(models.Restaurants.restaurant_id == restaurant_id).first()
    if restaurant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant with supplied ID not found"
        )
    return restaurant

# Get restaurants by name
@restaurants_router.get("/restaurants/name/{restaurant_name}", response_model=List[Restaurants])
async def retrieve_resto_by_name(restaurant_name: str, db: Session = Depends(get_db)):
    restaurants = db.query(models.Restaurants).filter(models.Restaurants.restaurant_name == restaurant_name).all()
    if not restaurants:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant '{restaurant_name}' not found"
        )
    return restaurants

# Get restaurants by location
@restaurants_router.get("/restaurants/loc/{location}", response_model=List[Restaurants])
async def retrieve_resto_by_location(location: str, db: Session = Depends(get_db)):
    restaurants = db.query(models.Restaurants).filter(models.Restaurants.detail_location == location).all()
    if not restaurants:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No restaurants found in location '{location}'"
        )
    return restaurants

# Add new restaurant
@restaurants_router.post('/restaurants')
async def add_resto(item: Restaurants, db: Session = Depends(get_db)):
    restaurant = models.Restaurants(**item.dict())
    if restaurant.distance_m > 500:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No restaurants with distance over 500m from {restaurant.university} are allowed"
        )
    else:
        db.add(restaurant)
        db.commit()
        db.refresh(restaurant)
    return restaurant

# Update restaurant by ID
@restaurants_router.put('/restaurants/{restaurant_id}')
async def update_resto(restaurant_id: int, item: Restaurants, db: Session = Depends(get_db)):
    restaurant = db.query(models.Restaurants).filter(models.Restaurants.restaurant_id == restaurant_id).first()
    if restaurant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant with ID {restaurant_id} is not found."
        )

    for key, value in item.dict().items():
        setattr(restaurant, key, value)

    db.commit()
    db.refresh(restaurant)
    return "Restaurant updated successfully."

# Delete restaurant by ID
@restaurants_router.delete('/restaurants/{restaurant_id}')
async def delete_resto(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(models.Restaurants).filter(models.Restaurants.restaurant_id == restaurant_id).first()
    if restaurant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant with ID {restaurant_id} is not found."
        )

    db.delete(restaurant)
    db.commit()

    return "Restaurant deleted successfully."
