from fastapi import HTTPException, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import MenuItems, MenuItemsOut
from database.database import get_db
from database import models
from middleware import oauth
from . import restaurantsRoute

menu_items_router = APIRouter(tags=['Menu Route'])

# Get all menu items - admin only
@menu_items_router.get("/admin/menu/all", response_model=List[MenuItemsOut])
async def retrieve_all_menu(db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        menu_items = db.query(models.MenuItem).all()
        return menu_items

# Get menu item by ID - admin only
@menu_items_router.get("/admin/menu/{menu_id}", response_model=MenuItemsOut)
async def retrieve_menu_by_id(menu_id: int, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        menu_item = db.query(models.MenuItem).filter(models.MenuItem.menu_id == menu_id).first()
        if not menu_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu with supplied ID does not exist"
            )
        return menu_item

# Get menu item in a nearby restaurant - all users
@menu_items_router.get("/users/restaurant/nearby/{restaurant_name}/menu", response_model=List[MenuItemsOut])
async def retrieve_menu_nearby_resto(restaurant_name: str, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    nearby_resto = await restaurantsRoute.retrieve_nearby_resto(db, current_user)
    for resto in nearby_resto:
        if resto.restaurant_name == restaurant_name:
            restaurant = db.query(models.Restaurants).filter(models.Restaurants.restaurant_name == restaurant_name).first()
            menu_item = db.query(models.MenuItem).filter(models.MenuItem.restaurant_id == restaurant.restaurant_id).all()
            return menu_item
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"There is no {restaurant_name} nearby."
    )

# Add new menu item - admin only
@menu_items_router.post('/admin/menu', response_model=MenuItemsOut)
async def add_menu(item: MenuItems, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        menu_item = models.MenuItem(**item.dict())
        db.add(menu_item)
        db.commit()

        # Retrieve all remaining menu items
        remaining_menu_items = db.query(models.MenuItem).all()

        # Reorder the menu IDs
        for index, item in enumerate(remaining_menu_items, start=1):
            item.menu_id = index

        # Commit the changes to the database
        db.commit()
        return menu_item

# Update menu item by ID -admin only
@menu_items_router.put('/admin/menu/{menu_id}')
async def update_menu(menu_id: int, item: MenuItems, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        menu_item = db.query(models.MenuItem).filter(models.MenuItem.menu_id == menu_id).first()
        if menu_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu with ID {menu_id} not found."
            )

        for key, value in item.dict().items():
            setattr(menu_item, key, value)

        db.commit()
        return "Menu updated successfully."

# Delete menu item by ID -admin only
@menu_items_router.delete('/admin/menu/{menu_id}')
async def delete_menu(menu_id: int, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        menu_item = db.query(models.MenuItem).filter(models.MenuItem.menu_id == menu_id).first()
        if menu_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu with ID {menu_id} not found."
            )

        # Delete the menu item
        db.delete(menu_item)
        db.commit()

        # Retrieve all remaining menu items
        remaining_menu_items = db.query(models.MenuItem).all()

        # Reorder the menu IDs
        for index, item in enumerate(remaining_menu_items, start=1):
            item.menu_id = index

        # Commit the changes to the database
        db.commit()
        return "Menu deleted successfully."

