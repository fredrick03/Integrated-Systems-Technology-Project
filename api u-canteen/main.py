from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.menuRoute import menu_items_router
from routes.restaurantsRoute import restaurants_router
from routes.usersRoute import users_router, authentication
from routes.universityRoute import university_router
import database.models as models
import uvicorn

app = FastAPI()

# Middleware to enable CORS for all origins during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default route for the root URL
@app.get("/")
async def read_root():
    return "Welcome to U-Canteen!"

# Include routers with correct prefixes
app.include_router(authentication)
app.include_router(users_router)
app.include_router(university_router)
app.include_router(restaurants_router)
app.include_router(menu_items_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
