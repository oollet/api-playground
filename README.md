# 🚀 API Playground

Learn how to **create and consume REST APIs** with Python and JavaScript. Perfect for beginners!

## 🌐 Live Demos

| Service | URL | Description |
|---------|-----|-------------|
| **🌐 Web App** | [api-playground-tawny.vercel.app](https://api-playground-tawny.vercel.app) | Interactive Next.js playground |
| **🚀 API Server** | [api-playground-zita.onrender.com](https://api-playground-zita.onrender.com) | FastAPI backend |
| **📚 API Docs** | [/docs](https://api-playground-zita.onrender.com/docs) | Interactive Swagger docs |

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph Client["🖥️ Clients"]
        PY["🐍 Python Script<br/>(client/)"]
        WEB["⚛️ Next.js App<br/>(web/)"]
    end
    
    subgraph Server["☁️ Cloud"]
        API["🚀 FastAPI Server<br/>(server/)"]
        DB[("📦 In-Memory<br/>Database")]
    end
    
    PY -->|HTTP Requests| API
    WEB -->|HTTP Requests| API
    API --> DB
```

## 📂 Project Structure

```mermaid
graph TD
    ROOT["📁 api-playground"] --> CLIENT["📁 client/"]
    ROOT --> SERVER["📁 server/"]
    ROOT --> WEB["📁 web/"]
    
    CLIENT --> PY["🐍 api_client.py"]
    CLIENT --> REQ1["📋 requirements.txt"]
    
    SERVER --> MAIN["🚀 main.py"]
    SERVER --> REQ2["📋 requirements.txt"]
    
    WEB --> SRC["📁 src/"]
    WEB --> PKG["📦 package.json"]
    SRC --> APP["📁 app/"]
    SRC --> LIB["📁 lib/"]
    APP --> PAGE["⚛️ page.tsx"]
    LIB --> APITS["🔗 api.ts"]
```

## 🔧 REST API Flow

```mermaid
sequenceDiagram
    participant C as 🖥️ Client
    participant S as 🚀 Server
    participant D as 📦 Database
    
    Note over C,D: GET - Read Data
    C->>S: GET /objects
    S->>D: Fetch all items
    D-->>S: Return items
    S-->>C: 200 OK + JSON data
    
    Note over C,D: POST - Create Data
    C->>S: POST /objects {name, data}
    S->>D: Insert new item
    D-->>S: Confirm + new ID
    S-->>C: 201 Created + new object
    
    Note over C,D: DELETE - Remove Data
    C->>S: DELETE /objects/123
    S->>D: Remove item 123
    D-->>S: Confirm deletion
    S-->>C: 200 OK + message
```

## 🎯 HTTP Methods

```mermaid
graph LR
    subgraph Methods["HTTP Methods"]
        GET["🟢 GET<br/>Read"]
        POST["🔵 POST<br/>Create"]
        PUT["🟠 PUT<br/>Replace"]
        PATCH["🟣 PATCH<br/>Update"]
        DELETE["🔴 DELETE<br/>Remove"]
    end
    
    GET --> |"Safe, no changes"| R1["View products"]
    POST --> |"Adds new data"| R2["Add to cart"]
    PUT --> |"Replaces entirely"| R3["Update profile"]
    PATCH --> |"Partial change"| R4["Change password"]
    DELETE --> |"Removes data"| R5["Delete account"]
```

## 🏃‍♀️ Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+ and pnpm

### 1. Run the Python Client

```bash
# Set up Python environment
cd client
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run the demo
python api_client.py
```

### 2. Run the Server Locally

```bash
cd server
pip install -r requirements.txt
python main.py
# Visit: http://localhost:8000/docs
```

### 3. Run the Web App

```bash
cd web
pnpm install
pnpm dev
# Visit: http://localhost:3000
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/objects` | Get all objects |
| `GET` | `/objects/{id}` | Get single object |
| `POST` | `/objects` | Create new object |
| `PUT` | `/objects/{id}` | Replace object |
| `PATCH` | `/objects/{id}` | Partial update |
| `DELETE` | `/objects/{id}` | Delete object |

## 🚀 Deployment

### Server → Render.com

The `render.yaml` file auto-configures deployment:

```bash
git push origin main
# Then on Render: New → Blueprint → Connect repo
```

### Web App → Vercel ✅

**Already deployed!** Visit: [api-playground-tawny.vercel.app](https://api-playground-tawny.vercel.app)

To deploy your own:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `oollet/api-playground`
3. Set **Root Directory**: `web`
4. Deploy!

## 🔢 HTTP Status Codes

```mermaid
graph TD
    subgraph Success["✅ Success (2xx)"]
        S200["200 OK"]
        S201["201 Created"]
    end
    
    subgraph ClientError["⚠️ Client Error (4xx)"]
        E400["400 Bad Request"]
        E404["404 Not Found"]
    end
    
    subgraph ServerError["❌ Server Error (5xx)"]
        E500["500 Internal Error"]
    end
```

## 📚 Learning Path

```mermaid
graph LR
    A["1️⃣ Read the Code"] --> B["2️⃣ Run Examples"]
    B --> C["3️⃣ Modify & Experiment"]
    C --> D["4️⃣ Build Your Own!"]
    
    style A fill:#e1f5fe
    style B fill:#e8f5e9
    style C fill:#fff3e0
    style D fill:#f3e5f5
```

### Key Files to Study

| File | What You'll Learn |
|------|-------------------|
| `client/api_client.py` | Making HTTP requests with Python |
| `server/main.py` | Building REST APIs with FastAPI |
| `web/src/lib/api.ts` | Fetch API in TypeScript |
| `web/src/app/page.tsx` | React components & state |

## ✅ Progress

- [x] Python API client
- [x] FastAPI server
- [x] Deploy server to Render
- [x] Next.js web app with shadcn/ui
- [x] Deploy web app to Vercel
- [ ] Add authentication
- [ ] Connect to real database

---

Built with ❤️ for learning | [View on GitHub](https://github.com/oollet/api-playground)
