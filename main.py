from fastapi import FastAPI
from routes.menuRoute import menu_items_router
from routes.restaurantsRoute import restaurants_router
from routes.usersRoute import users_router
from database.config import settings
from database.database import engine
import database.models as models
import uvicorn

app = FastAPI()
# models.Base.metadata.create_all(bind=engine)

# Default route for the root URL
@app.get("/")
async def read_root():
    return "Welcome to U-Canteen!"

# Include routers with correct prefixes
app.include_router(menu_items_router)
app.include_router(restaurants_router)
app.include_router(users_router)

if __name__	=="__main__":	
    uvicorn.run("main:app",	host="localhost",port=8000, reload=True)	