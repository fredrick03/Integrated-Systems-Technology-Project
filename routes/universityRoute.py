from fastapi import HTTPException, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import University
from database.database import get_db
from database import models
from middleware import oauth

university_router = APIRouter(tags=['University Route'])

# all routes for university are limited to admin only
# Get all universities
@university_router.get("/admin/univeristy/all", response_model=List[University])
async def retrieve_all_uni(db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        university = db.query(models.University).all()
        return university

# Get university by name
@university_router.get("/admin/university/{univeristy_name}", response_model=University)
async def retrieve_uni_by_name(university_name: str, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        university = db.query(models.University).filter(models.University.university_name == university_name).first()
        if university is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{university_name} does not exist."
            )
        return university

# Add new university
@university_router.post('/admin/university', response_model=University)
async def add_uni(item: University, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        university = models.University(**item.dict())
        db.add(university)
        db.commit()
        return university
        
# Update university item by name
@university_router.put('/admin/university/{university_name}')
async def update_uni(university_name: str, item: University, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    if current_user.is_admin == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unauthorized")
    else:
        university = db.query(models.University).filter(models.University.university_name == university_name).first()
        if university is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{university_name} not found."
            )

        for key, value in item.dict().items():
            setattr(university, key, value)

        db.commit()
        return "Restaurant updated successfully."

@university_router.delete('/admin/university/{university_name}')
async def delete_uni(university_name: str, db: Session = Depends(get_db), current_user: models.Users = Depends(oauth.get_current_user)):
    university = db.query(models.University).filter(models.University.university_name == university_name).first()
    if university is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{university_name} not found."
        )

    # Delete the university
    db.delete(university)
    db.commit()
    return "University deleted successfully."

