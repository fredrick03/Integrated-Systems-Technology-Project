from fastapi import HTTPException, status, APIRouter, Depends
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from schemas import Users
from database.database import get_db
from database import models
from middleware import oauth, auth_utils
import schemas

authentication = APIRouter(tags=['Authentication'])
users_router = APIRouter(tags=['User Route'])

# signup
@authentication.post('/signup', response_model=schemas.UsersOut)
async def add_user(item: Users, db: Session = Depends(get_db)):
    if not item.password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password is required",
        )
    
    user = models.Users(**item.dict())
    # hash the password - user.password
    hashed_password = auth_utils.hash(user.password)
    user.password = hashed_password
    db.add(user)
    db.commit()
    
    # Retrieve all remaining user items
    remaining_users = db.query(models.Users).all()

    # Reorder the user IDs
    for index, item in enumerate(remaining_users, start=1):
        item.user_id = index

    # Commit the changes to the database
    db.commit()
    return user

# login
@authentication.post('/login', response_model=schemas.LoginResponse)
def login(credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = db.query(models.Users).filter(
        models.Users.username == credentials.username).first()

    if not user or not auth_utils.verify(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    access_token = oauth.create_access_token(data={"user_id": user.user_id})
    user.access_token = access_token
    user.token_type = "bearer"

    # return {"access_token": access_token, "token_type": "bearer"}
    return user

# logout
@authentication.post('/logout', response_model=schemas.LoginResponse)
def logout(db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    current_user = db.query(models.Users).filter(
        models.Users.email == current_user.email).first()

    current_user.access_token = '-'
    current_user.token_type = '-'

    # return {"access_token": access_token, "token_type": "bearer"}
    return current_user

# Get all users - admin only
@users_router.get("/admin/users/all", response_model=List[schemas.UsersOut])
async def retrieve_all_users(db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        users = db.query(models.Users).all()
        return users

# Get user by ID - admin only
@users_router.get("/admin/users/{user_id}", response_model=schemas.UsersOut)
async def retrieve_user_by_id(user_id: int, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        user = db.query(models.Users).filter(models.Users.user_id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User with supplied ID does not exist"
            )
        return user

# Get curent_user data - all users
@users_router.get("/users/myaccount", response_model=schemas.Users)
async def retrieve_current_user_data(db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    return current_user

# Update current user data - all users
@users_router.put('/users/myaccount')
async def update_current_user_data(item: Users, current_user: models.Users = Depends(oauth.get_current_user), db: Session = Depends(get_db)):
    for key, value in item.dict().items():
        setattr(current_user, key, value)
    db.commit()

    # Retrieve all remaining user items
    remaining_users = db.query(models.Users).all()

    # Reorder the user IDs
    for index, item in enumerate(remaining_users, start=1):
        item.user_id = index

    # Commit the changes to the database
    db.commit()
    return "User updated successfully."

# Delete user by ID - admin only
@users_router.delete('/admin/users/{user_id}')
async def delete_user(user_id: int, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        user = db.query(models.Users).filter(models.Users.user_id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found."
            )

        db.delete(user)
        db.commit()

        # Retrieve all remaining user items
        remaining_users = db.query(models.Users).all()

        # Reorder the user IDs
        for index, item in enumerate(remaining_users, start=1):
            item.user_id = index

        # Commit the changes to the database
        db.commit()
        return "User deleted successfully."
