"""
API Client - Learning to consume REST APIs with Python
=======================================================

This script demonstrates how to interact with a REST API using Python.
We use the 'requests' library to make HTTP calls.

REST API Basics:
- GET    = Read data (like viewing a webpage)
- POST   = Create new data (like submitting a form)
- PUT    = Update existing data (replace everything)
- PATCH  = Update existing data (change only some fields)
- DELETE = Remove data

You can switch between different API servers below!
"""

import requests  # This library helps us make HTTP requests

# =============================================================================
# 🔧 CONFIGURE YOUR API URL HERE
# =============================================================================
# Uncomment ONE of these lines to choose which API to use:

# Option 1: External test API (default)
API_URL = "https://api.restful-api.dev/objects"

# Option 2: Your local FastAPI server (run: python server/main.py)
# API_URL = "http://localhost:8000/objects"

# Option 3: Your Render deployment (replace with your actual URL)
# API_URL = "https://your-app-name.onrender.com/objects"

# =============================================================================


def get_all_objects():
    """
    GET all objects from the API.
    
    This is like asking: "Show me everything you have!"
    The API returns a list of all products in its database.
    """
    print("\n" + "=" * 50)
    print("📚 FETCHING ALL OBJECTS FROM API")
    print("=" * 50)
    
    # Make a GET request to the API
    response = requests.get(API_URL)
    
    # Check if the request was successful (status code 200 means OK)
    if response.status_code == 200:
        objects = response.json()  # Convert JSON response to Python list
        print(f"✅ Success! Found {len(objects)} objects.\n")
        
        # Display first 5 objects to keep output readable
        for obj in objects[:5]:
            print(f"  ID: {obj['id']}")
            print(f"  Name: {obj['name']}")
            print(f"  Data: {obj.get('data', 'No additional data')}")
            print("-" * 40)
        
        if len(objects) > 5:
            print(f"  ... and {len(objects) - 5} more objects")
        
        return objects
    else:
        print(f"❌ Error: Could not fetch data. Status code: {response.status_code}")
        return None


def get_single_object(object_id):
    """
    GET a single object by its ID.
    
    This is like asking: "Show me just this one specific item!"
    """
    print("\n" + "=" * 50)
    print(f"🔍 FETCHING OBJECT WITH ID: {object_id}")
    print("=" * 50)
    
    # Add the ID to the URL to get a specific object
    url = f"{API_URL}/{object_id}"
    response = requests.get(url)
    
    if response.status_code == 200:
        obj = response.json()
        print(f"✅ Found it!\n")
        print(f"  ID: {obj['id']}")
        print(f"  Name: {obj['name']}")
        print(f"  Data: {obj.get('data', 'No additional data')}")
        return obj
    else:
        print(f"❌ Error: Object not found. Status code: {response.status_code}")
        return None


def create_object(name, data=None):
    """
    POST a new object to the API.
    
    This is like saying: "Please add this new item to your database!"
    We send the data we want to create, and the API gives it an ID.
    """
    print("\n" + "=" * 50)
    print("➕ CREATING A NEW OBJECT")
    print("=" * 50)
    
    # The data we want to send to create a new object
    new_object = {
        "name": name,
        "data": data
    }
    
    print(f"Sending: {new_object}")
    
    # Make a POST request with our data
    # We use 'json=' to automatically convert our dict to JSON
    response = requests.post(API_URL, json=new_object)
    
    if response.status_code in [200, 201]:  # 201 = Created
        created = response.json()
        print(f"\n✅ Object created successfully!")
        print(f"  New ID: {created.get('id')}")
        print(f"  Name: {created.get('name')}")
        print(f"  Data: {created.get('data')}")
        print(f"  Created at: {created.get('createdAt', 'N/A')}")
        return created
    else:
        print(f"❌ Error: Could not create object. Status code: {response.status_code}")
        print(f"Response: {response.text}")
        return None


def update_object(object_id, name, data=None):
    """
    PUT to update an existing object (replaces the entire object).
    
    This is like saying: "Replace everything about this item with new info!"
    """
    print("\n" + "=" * 50)
    print(f"✏️ UPDATING OBJECT WITH ID: {object_id}")
    print("=" * 50)
    
    url = f"{API_URL}/{object_id}"
    updated_data = {
        "name": name,
        "data": data
    }
    
    print(f"Sending update: {updated_data}")
    
    response = requests.put(url, json=updated_data)
    
    if response.status_code == 200:
        updated = response.json()
        print(f"\n✅ Object updated successfully!")
        print(f"  ID: {updated.get('id')}")
        print(f"  Name: {updated.get('name')}")
        print(f"  Data: {updated.get('data')}")
        print(f"  Updated at: {updated.get('updatedAt', 'N/A')}")
        return updated
    else:
        print(f"❌ Error: Could not update object. Status code: {response.status_code}")
        print(f"Response: {response.text}")
        return None


def patch_object(object_id, name=None, data=None):
    """
    PATCH to partially update an existing object.
    
    This is like saying: "Just change these specific things, keep the rest!"
    Unlike PUT, PATCH only updates the fields you specify.
    """
    print("\n" + "=" * 50)
    print(f"🔧 PATCHING OBJECT WITH ID: {object_id}")
    print("=" * 50)
    
    url = f"{API_URL}/{object_id}"
    patch_data = {}
    
    if name is not None:
        patch_data["name"] = name
    if data is not None:
        patch_data["data"] = data
    
    print(f"Sending patch: {patch_data}")
    
    response = requests.patch(url, json=patch_data)
    
    if response.status_code == 200:
        patched = response.json()
        print(f"\n✅ Object patched successfully!")
        print(f"  ID: {patched.get('id')}")
        print(f"  Name: {patched.get('name')}")
        print(f"  Data: {patched.get('data')}")
        print(f"  Updated at: {patched.get('updatedAt', 'N/A')}")
        return patched
    else:
        print(f"❌ Error: Could not patch object. Status code: {response.status_code}")
        print(f"Response: {response.text}")
        return None


def delete_object(object_id):
    """
    DELETE an object from the API.
    
    This is like saying: "Please remove this item from your database!"
    Be careful - this action cannot be undone!
    """
    print("\n" + "=" * 50)
    print(f"🗑️ DELETING OBJECT WITH ID: {object_id}")
    print("=" * 50)
    
    url = f"{API_URL}/{object_id}"
    response = requests.delete(url)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Object deleted successfully!")
        print(f"  Message: {result.get('message', 'Deleted')}")
        return True
    else:
        print(f"❌ Error: Could not delete object. Status code: {response.status_code}")
        print(f"Response: {response.text}")
        return False


def demo_all_operations():
    """
    Demonstrate all CRUD operations in sequence.
    
    CRUD stands for:
    - Create (POST)
    - Read (GET)
    - Update (PUT/PATCH)
    - Delete (DELETE)
    """
    print("\n" + "🚀" * 25)
    print("   WELCOME TO THE API CLIENT DEMO!")
    print("   Learning REST APIs with Python")
    print("🚀" * 25)
    
    # 1. READ - Get all existing objects
    print("\n\n📖 STEP 1: Reading existing data...")
    get_all_objects()
    
    # 2. READ - Get a single object
    print("\n\n📖 STEP 2: Reading a single object...")
    get_single_object("1")
    
    # 3. CREATE - Add a new object
    print("\n\n📝 STEP 3: Creating a new object...")
    new_product = create_object(
        name="My Learning Laptop",
        data={
            "year": 2024,
            "price": 999.99,
            "color": "Space Gray",
            "purpose": "Learning Python APIs!"
        }
    )
    
    # If creation was successful, continue with update and delete
    if new_product and new_product.get('id'):
        new_id = new_product['id']
        
        # 4. UPDATE - Modify the object we just created
        print("\n\n✏️ STEP 4: Updating our object...")
        update_object(
            object_id=new_id,
            name="My Updated Learning Laptop",
            data={
                "year": 2024,
                "price": 899.99,  # On sale!
                "color": "Midnight Black",
                "purpose": "Mastering Python APIs!"
            }
        )
        
        # 5. PATCH - Partially update the object
        print("\n\n🔧 STEP 5: Patching just the name...")
        patch_object(
            object_id=new_id,
            name="Super Learning Laptop Pro"
        )
        
        # 6. DELETE - Remove the object
        print("\n\n🗑️ STEP 6: Deleting our test object...")
        delete_object(new_id)
    
    print("\n\n" + "🎉" * 25)
    print("   DEMO COMPLETE!")
    print("   You've learned all CRUD operations!")
    print("🎉" * 25)
    print("\n")


# This runs when you execute the script directly
if __name__ == "__main__":
    demo_all_operations()

