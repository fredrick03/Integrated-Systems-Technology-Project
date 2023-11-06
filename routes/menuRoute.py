from fastapi import HTTPException, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import MenuItems
from database.database import get_db
import database.models as models

menu_items_router = APIRouter()

# Get all menu items
@menu_items_router.get("/menu", response_model=List[MenuItems])
async def retrieve_all_menu(db: Session = Depends(get_db)):
    menu_items = db.query(models.MenuItem).all()
    return menu_items

# Get menu item by ID
@menu_items_router.get("/menu/{menu_id}", response_model=MenuItems)
async def retrieve_menu(menu_id: int, db: Session = Depends(get_db)):
    menu_item = db.query(models.MenuItem).filter(models.MenuItem.menu_id == menu_id).first()
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu with supplied ID does not exist"
        )
    return menu_item

# Add new menu item
@menu_items_router.post('/menu')
async def add_menu(item: MenuItems, db: Session = Depends(get_db)):
    menu_item = models.MenuItem(**item.dict())
    db.add(menu_item)
    db.commit()
    db.refresh(menu_item)
    return menu_item

# Update menu item by ID
@menu_items_router.put('/menu/{menu_id}')
async def update_menu(menu_id: int, item: MenuItems, db: Session = Depends(get_db)):
    menu_item = db.query(models.MenuItem).filter(models.MenuItem.menu_id == menu_id).first()
    if menu_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menu with ID {menu_id} not found."
        )

    for key, value in item.dict().items():
        setattr(menu_item, key, value)

    db.commit()
    db.refresh(menu_item)
    return menu_item

@menu_items_router.delete('/menu/{menu_id}')
async def delete_menu(menu_id: int, db: Session = Depends(get_db)):
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

