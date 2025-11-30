"""
FastAPI Server - Learning to CREATE APIs with Python
=====================================================

This is a simple REST API server that mimics https://api.restful-api.dev/objects
Data is stored in memory (a Python list), so it resets when the server restarts.

Endpoints:
- GET    /objects        → Get all objects
- GET    /objects/{id}   → Get one object by ID
- POST   /objects        → Create a new object
- PUT    /objects/{id}   → Replace an object entirely
- PATCH  /objects/{id}   → Update specific fields of an object
- DELETE /objects/{id}   → Delete an object
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime
import uuid

# Create the FastAPI application
app = FastAPI(
    title="API Playground Server",
    description="A simple REST API for learning - mimics api.restful-api.dev",
    version="1.0.0"
)

# Allow requests from any origin (for development/learning)
# In production, you'd restrict this to specific domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# DATA MODELS (Pydantic)
# =============================================================================
# These define the structure of data we accept and return

class ObjectData(BaseModel):
    """The 'data' field can contain any key-value pairs"""
    class Config:
        extra = "allow"  # Allow any additional fields


class ObjectCreate(BaseModel):
    """Schema for creating a new object (POST request)"""
    name: str
    data: Optional[dict[str, Any]] = None


class ObjectUpdate(BaseModel):
    """Schema for updating an object (PUT request)"""
    name: str
    data: Optional[dict[str, Any]] = None


class ObjectPatch(BaseModel):
    """Schema for partial update (PATCH request) - all fields optional"""
    name: Optional[str] = None
    data: Optional[dict[str, Any]] = None


class ObjectResponse(BaseModel):
    """Schema for object responses"""
    id: str
    name: str
    data: Optional[dict[str, Any]] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


# =============================================================================
# IN-MEMORY DATABASE
# =============================================================================
# This list stores all our objects. It resets when the server restarts.
# In a real app, you'd use a database like PostgreSQL, MongoDB, etc.

objects_db: list[dict] = [
    {
        "id": "1",
        "name": "Google Pixel 6 Pro",
        "data": {"color": "Cloudy White", "capacity": "128 GB"}
    },
    {
        "id": "2",
        "name": "Apple iPhone 12 Mini, 256GB, Blue",
        "data": None
    },
    {
        "id": "3",
        "name": "Apple iPhone 12 Pro Max",
        "data": {"color": "Cloudy White", "capacity GB": 512}
    },
    {
        "id": "4",
        "name": "Apple iPhone 11, 64GB",
        "data": {"price": 389.99, "color": "Purple"}
    },
    {
        "id": "5",
        "name": "Samsung Galaxy Z Fold2",
        "data": {"price": 689.99, "color": "Brown"}
    },
    {
        "id": "6",
        "name": "Apple AirPods",
        "data": {"generation": "3rd", "price": 120}
    },
    {
        "id": "7",
        "name": "Apple MacBook Pro 16",
        "data": {"year": 2019, "price": 1849.99, "CPU model": "Intel Core i9", "Hard disk size": "1 TB"}
    },
    {
        "id": "8",
        "name": "Apple Watch Series 8",
        "data": {"Strap Colour": "Elderberry", "Case Size": "41mm"}
    },
    {
        "id": "9",
        "name": "Beats Studio3 Wireless",
        "data": {"Color": "Red", "Description": "High-performance wireless noise cancelling headphones"}
    },
    {
        "id": "10",
        "name": "Apple iPad Mini 5th Gen",
        "data": {"Capacity": "64 GB", "Screen size": 7.9}
    },
    {
        "id": "11",
        "name": "Apple iPad Mini 5th Gen",
        "data": {"Capacity": "254 GB", "Screen size": 7.9}
    },
    {
        "id": "12",
        "name": "Apple iPad Air",
        "data": {"Generation": "4th", "Price": "419.99", "Capacity": "64 GB"}
    },
    {
        "id": "13",
        "name": "Apple iPad Air",
        "data": {"Generation": "4th", "Price": "519.99", "Capacity": "256 GB"}
    }
]


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def find_object_by_id(object_id: str) -> dict | None:
    """Find an object in our database by its ID"""
    for obj in objects_db:
        if obj["id"] == object_id:
            return obj
    return None


def get_timestamp() -> str:
    """Get current timestamp in ISO format"""
    return datetime.utcnow().isoformat() + "+00:00"


# =============================================================================
# API ENDPOINTS (Routes)
# =============================================================================

@app.get("/")
def root():
    """
    Root endpoint - welcome message and API info
    """
    return {
        "message": "Welcome to API Playground Server! 🚀",
        "docs": "/docs",
        "endpoints": {
            "GET /objects": "Get all objects",
            "GET /objects/{id}": "Get one object",
            "POST /objects": "Create new object",
            "PUT /objects/{id}": "Update entire object",
            "PATCH /objects/{id}": "Partial update",
            "DELETE /objects/{id}": "Delete object"
        }
    }


@app.get("/objects", response_model=list[ObjectResponse])
def get_all_objects():
    """
    GET all objects
    
    Returns the complete list of objects in our database.
    This is equivalent to: GET https://api.restful-api.dev/objects
    """
    return objects_db


@app.get("/objects/{object_id}", response_model=ObjectResponse)
def get_single_object(object_id: str):
    """
    GET a single object by ID
    
    Returns one object if found, or 404 error if not found.
    This is equivalent to: GET https://api.restful-api.dev/objects/{id}
    """
    obj = find_object_by_id(object_id)
    
    if obj is None:
        raise HTTPException(
            status_code=404,
            detail=f"Object with id '{object_id}' not found"
        )
    
    return obj


@app.post("/objects", response_model=ObjectResponse, status_code=200)
def create_object(new_object: ObjectCreate):
    """
    POST - Create a new object
    
    Accepts name and optional data, assigns a unique ID.
    This is equivalent to: POST https://api.restful-api.dev/objects
    """
    # Generate a unique ID (similar to the real API)
    new_id = str(uuid.uuid4()).replace("-", "")[:32]
    
    # Create the new object
    created_object = {
        "id": new_id,
        "name": new_object.name,
        "data": new_object.data,
        "createdAt": get_timestamp()
    }
    
    # Add to our database
    objects_db.append(created_object)
    
    return created_object


@app.put("/objects/{object_id}", response_model=ObjectResponse)
def update_object(object_id: str, updated_object: ObjectUpdate):
    """
    PUT - Replace an object entirely
    
    Replaces all fields of an existing object.
    This is equivalent to: PUT https://api.restful-api.dev/objects/{id}
    """
    obj = find_object_by_id(object_id)
    
    if obj is None:
        raise HTTPException(
            status_code=404,
            detail=f"Object with id '{object_id}' not found"
        )
    
    # Update the object
    obj["name"] = updated_object.name
    obj["data"] = updated_object.data
    obj["updatedAt"] = get_timestamp()
    
    return obj


@app.patch("/objects/{object_id}", response_model=ObjectResponse)
def patch_object(object_id: str, patch_data: ObjectPatch):
    """
    PATCH - Partially update an object
    
    Only updates the fields that are provided.
    This is equivalent to: PATCH https://api.restful-api.dev/objects/{id}
    """
    obj = find_object_by_id(object_id)
    
    if obj is None:
        raise HTTPException(
            status_code=404,
            detail=f"Object with id '{object_id}' not found"
        )
    
    # Only update fields that were provided
    if patch_data.name is not None:
        obj["name"] = patch_data.name
    if patch_data.data is not None:
        obj["data"] = patch_data.data
    
    obj["updatedAt"] = get_timestamp()
    
    return obj


@app.delete("/objects/{object_id}")
def delete_object(object_id: str):
    """
    DELETE - Remove an object
    
    Removes an object from the database.
    This is equivalent to: DELETE https://api.restful-api.dev/objects/{id}
    """
    obj = find_object_by_id(object_id)
    
    if obj is None:
        raise HTTPException(
            status_code=404,
            detail=f"Object with id '{object_id}' not found"
        )
    
    # Remove from database
    objects_db.remove(obj)
    
    return {
        "message": f"Object with id = {object_id} has been deleted."
    }


# =============================================================================
# RUN SERVER (for local development)
# =============================================================================
# This only runs when you execute: python main.py
# In production (Render), uvicorn runs the app directly

if __name__ == "__main__":
    import uvicorn
    print("\n🚀 Starting API Playground Server...")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔗 Objects: http://localhost:8000/objects\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)

