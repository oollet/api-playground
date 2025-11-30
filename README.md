# 🚀 API Playground - Learn REST APIs with Python

Welcome! This project will teach you how to **create and consume APIs** using Python. Perfect for beginners with no programming experience!

## 📂 Project Structure

```
api-playground/
├── client/              # Python scripts to CONSUME APIs (talk to other servers)
│   ├── api_client.py    # Main script with all API operations
│   └── requirements.txt # Python packages we need
├── server/              # (Coming soon) Create your OWN API
└── README.md            # You are here!
```

## 🤔 What is an API?

**API** stands for **Application Programming Interface**. Think of it like a waiter at a restaurant:

1. You (the client) tell the waiter what you want
2. The waiter goes to the kitchen (the server)
3. The kitchen prepares your food
4. The waiter brings it back to you

In programming:
- **Client** = Your Python script (or web app)
- **API** = The "waiter" that handles requests
- **Server** = Where the data lives

## 🔧 What is REST?

**REST** is a set of rules for how clients and servers communicate. The main "verbs" are:

| Method | What it does | Real-world example |
|--------|-------------|-------------------|
| `GET` | Read data | Looking at a menu |
| `POST` | Create new data | Placing an order |
| `PUT` | Replace data completely | Changing your entire order |
| `PATCH` | Update part of data | "Actually, make that a medium instead of large" |
| `DELETE` | Remove data | Canceling your order |

## 🏃‍♀️ Getting Started

### Step 1: Set up Python environment

Open your terminal and navigate to the project:

```bash
cd /path/to/api-playground
```

Create a virtual environment (keeps your packages organized):

```bash
# Create virtual environment
python3 -m venv venv

# Activate it (Mac/Linux)
source venv/bin/activate

# Activate it (Windows)
venv\Scripts\activate
```

### Step 2: Install dependencies

```bash
pip install -r client/requirements.txt
```

### Step 3: Run the demo!

```bash
python client/api_client.py
```

You'll see the script:
1. 📚 Fetch all products from the test API
2. 🔍 Get a single product by ID
3. ➕ Create a new product
4. ✏️ Update that product
5. 🔧 Patch (partially update) the product
6. 🗑️ Delete the product

## 📖 Understanding the Code

### Making a GET request (Reading data)

```python
import requests

response = requests.get("https://api.restful-api.dev/objects")
data = response.json()  # Convert response to Python list/dict
print(data)
```

### Making a POST request (Creating data)

```python
new_item = {
    "name": "My Product",
    "data": {"price": 99.99}
}

response = requests.post("https://api.restful-api.dev/objects", json=new_item)
created_item = response.json()
print(created_item)  # Now has an ID!
```

### Status Codes to Know

| Code | Meaning |
|------|---------|
| `200` | OK - Everything worked! |
| `201` | Created - New item was made |
| `400` | Bad Request - You sent something wrong |
| `404` | Not Found - Item doesn't exist |
| `500` | Server Error - Something broke on their end |

## 🧪 The Test API We're Using

We're using a free practice API: https://api.restful-api.dev/objects

It simulates a product database with items like:
- Apple iPhones
- Samsung phones
- MacBooks
- AirPods
- And more!

**Note:** This is a public test API. Objects you create may be deleted periodically.

## 📚 What's Next?

- [ ] **Expand the client** - Build a web app using Flask or FastAPI
- [ ] **Build the server** - Create your OWN API in the `server/` folder
- [ ] **Add authentication** - Learn about API keys and tokens
- [ ] **Connect to a database** - Store data permanently

## 🆘 Troubleshooting

### "command not found: python3"
Install Python from https://python.org

### "No module named requests"
Make sure you activated your virtual environment and ran `pip install -r client/requirements.txt`

### "Connection error"
Check your internet connection. The API might also be temporarily down.

---

Happy coding! 🎉 Remember: Every expert was once a beginner!

