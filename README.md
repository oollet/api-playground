# 🚀 API Playground - Learn REST APIs with Python

Welcome! This project teaches you how to **create and consume APIs** using Python. Perfect for beginners!

## 🌐 Live API

**Your API is live at:** https://api-playground-zita.onrender.com

| URL | Description |
|-----|-------------|
| [/docs](https://api-playground-zita.onrender.com/docs) | Interactive API documentation |
| [/objects](https://api-playground-zita.onrender.com/objects) | Get all objects |

## 📂 Project Structure

```
api-playground/
├── client/                  # Python scripts to CONSUME APIs
│   ├── api_client.py        # Main script with all API operations
│   └── requirements.txt     # Client dependencies (requests)
├── server/                  # FastAPI server (YOUR OWN API!)
│   ├── main.py              # API with all CRUD endpoints
│   └── requirements.txt     # Server dependencies (fastapi, uvicorn)
├── render.yaml              # Render.com deployment config
└── README.md                # You are here!
```

## 🤔 What is an API?

**API** = **Application Programming Interface**

Think of it like a waiter at a restaurant:
1. You (the client) tell the waiter what you want
2. The waiter goes to the kitchen (the server)
3. The kitchen prepares your food
4. The waiter brings it back to you

## 🔧 REST API Methods

| Method | What it does | Example |
|--------|-------------|---------|
| `GET` | Read data | Looking at a menu |
| `POST` | Create new data | Placing an order |
| `PUT` | Replace data entirely | Changing your whole order |
| `PATCH` | Update part of data | "Make that a medium" |
| `DELETE` | Remove data | Canceling your order |

## 🏃‍♀️ Quick Start

### Run the Client (consumes your API)

```bash
# Set up environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install & run
pip install -r client/requirements.txt
python client/api_client.py
```

### Run the Server Locally

```bash
# Install & run
pip install -r server/requirements.txt
python server/main.py
```

Then visit:
- **API Docs**: http://localhost:8000/docs
- **Objects**: http://localhost:8000/objects

## 📖 Code Examples

### GET Request (Read data)

```python
import requests

response = requests.get("https://api-playground-zita.onrender.com/objects")
data = response.json()
print(data)
```

### POST Request (Create data)

```python
new_item = {
    "name": "My Product",
    "data": {"price": 99.99}
}

response = requests.post("https://api-playground-zita.onrender.com/objects", json=new_item)
created = response.json()
print(created)  # Now has an ID!
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/objects` | Get all objects |
| GET | `/objects/{id}` | Get single object |
| POST | `/objects` | Create new object |
| PUT | `/objects/{id}` | Replace object |
| PATCH | `/objects/{id}` | Partial update |
| DELETE | `/objects/{id}` | Delete object |

## 🔢 HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Success! |
| `201` | Created - New item made |
| `400` | Bad Request - Something wrong with your request |
| `404` | Not Found - Item doesn't exist |
| `500` | Server Error - Something broke |

## 🚀 Deployment

This project is deployed on [Render.com](https://render.com) using the `render.yaml` configuration.

To deploy your own:
1. Fork this repo
2. Go to [dashboard.render.com](https://dashboard.render.com)
3. New → Blueprint → Connect your repo
4. Render auto-deploys!

## 📚 What's Next?

- [x] ~~Build the client~~ ✅
- [x] ~~Build the server~~ ✅
- [x] ~~Deploy to cloud~~ ✅
- [ ] Add authentication (API keys)
- [ ] Connect to a real database
- [ ] Build a web frontend

---

Happy coding! 🎉 Every expert was once a beginner!
