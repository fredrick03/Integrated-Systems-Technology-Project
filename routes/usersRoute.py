from fastapi import HTTPException, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import Users
from database.database import get_db
import database.models as models

users_router = APIRouter()

# Get all users
@users_router.get("/users", response_model=List[Users])
async def retrieve_all_users(db: Session = Depends(get_db)):
    users = db.query(models.Users).all()
    return users

# Get user by ID
@users_router.get("/users/{user_id}", response_model=Users)
async def retrieve_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.Users).filter(models.Users.user_id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with supplied ID does not exist"
        )
    return user

# Add new user
@users_router.post('/users')
async def add_user(item: Users, db: Session = Depends(get_db)):
    user = models.Users(**item.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Update user by ID
@users_router.put('/users/{user_id}')
async def update_user(user_id: int, item: Users, db: Session = Depends(get_db)):
    user = db.query(models.Users).filter(models.Users.user_id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )

    for key, value in item.dict().items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user

# Delete user by ID
@users_router.delete('/users/{user_id}')
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.Users).filter(models.Users.user_id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )

    db.delete(user)
    db.commit()

    return "User deleted successfully."
