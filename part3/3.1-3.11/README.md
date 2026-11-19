# Full Stack Phonebook

This project contains the Full Stack Open phonebook application (Exercises 3.1–3.11).

- **Live Application:** [Full Stack Phonebook](https://fullstackphonebook.msof.me/)

> **Note:** Data is stored in memory, in the backend process. It resets whenever the backend restarts.

## Installation

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Development

```mermaid
flowchart TD
    subgraph browser["Browser (Client)"]
        react["React App<br>(origin: http://localhost:5173)"]
    end

    subgraph vite["Vite Dev Server: Node.js Proc<br>(http://localhost:5173)"]
        modules["Module Server<br>(page + JS modules)"]
        proxy["Proxy Middleware<br>(/api/*)"]
    end

    subgraph backend["Backend: Node.js Proc<br>(http://localhost:3001)"]
        subgraph app["Express App"]
            routes["API Route Handlers<br>(/api/*)"]
        end
        memory["In-Memory Data<br>(persons array)"]
    end

    browser -->|"1. Requests page &<br>JS modules"| modules
    react -->|"2. API requests<br>(http://localhost:5173/api/*)"| proxy
    proxy -->|"3. Forwards to<br>http://localhost:3001/api/*"| routes
    routes -.->|"4. Reads & Writes<br>(in-process)"| memory
```

*Architecture diagram showing the request flow in development. Solid arrows show who initiates each request. Dotted arrows show in-process data access. The browser only talks to `localhost:5173`, so all requests are same-origin and no CORS is needed.*

1. Terminal 1 (Express server):

    ```bash
    cd backend
    npm run dev
    ```

2. Terminal 2 (Vite dev server):

    ```bash
    cd frontend
    npm run dev
    ```

3. Open `http://localhost:5173` in your browser.

The Vite dev server updates the frontend instantly with Hot Module Replacement (HMR), and proxies `/api/*` requests to the Express backend on port 3001 (configured in `vite.config.js`). The frontend uses the relative URL `/api/persons`, so the requests go through the proxy and no CORS is needed.

The backend restarts automatically when you change its files. This also resets the in-memory data.

## Local Production

```mermaid
flowchart TD
    subgraph browser["Browser (Client)"]
        react["React App<br>(origin: http://localhost:3001)"]
    end

    subgraph backend["Backend: Node.js Proc<br>(http://localhost:3001)"]
        subgraph app["Express App"]
            staticmw["Static Middleware<br>(express.static)"]
            routes["API Route Handlers<br>(/api/*)"]
        end
        memory["In-Memory Data<br>(persons array)"]
    end

    files["Frontend Build Output<br>(backend/dist)"]

    browser -->|"1. Requests page &<br>bundled assets"| staticmw
    staticmw -->|"2. Reads files"| files
    react -->|"3. API requests<br>(http://localhost:3001/api/*)"| routes
    routes -.->|"4. Reads & Writes<br>(in-process)"| memory
```

*Architecture diagram showing the request flow in local production. Solid arrows show who initiates each request or file read. Dotted arrows show in-process data access. `backend/dist` is generated beforehand by `npm run build:frontend`.*

1. Build the frontend into the backend:

    ```bash
    cd backend
    npm run build:frontend
    ```

    This script (defined in `backend/package.json`) runs `npm run build` in the `frontend` folder:

    ```json
    "build:frontend": "cd ../frontend && npm run build"
    ```

    The frontend's `vite.config.js` sets the build output to `backend/dist`, so Vite writes the production build directly into the backend. No separate copy step is needed:

    ```js
    build: {
      outDir: "../backend/dist", // write the build output into the backend
      emptyOutDir: true,         // clear old files first (required because outDir is outside the frontend folder)
    },
    ```

2. Start the production server:

    ```bash
    npm start
    ```

3. Open `http://localhost:3001` in your browser.

Express now serves both the production build of the React frontend and the API from the same origin, so neither the Vite proxy nor CORS is needed.

## Production

The app is deployed on [Coolify](https://coolify.io/) as a single Node.js process: Express serves both the frontend build and the API from the same origin.

### Architecture

<!-- TODO: Add architecture diagram -->

### Deploying Changes

Coolify does **not** build the frontend. Express serves the `backend/dist` folder committed to Git, so the frontend must be rebuilt and committed before each deployment.

1. Build the frontend into the backend:

    ```bash
    cd backend
    npm run build:frontend
    ```

2. Commit the changes, including `backend/dist`, and push to `main`.

3. Coolify detects the push and redeploys automatically. It installs the backend dependencies and starts the server with `npm start`.

> **Note:** The repository's root `.gitignore` ignores all `dist` folders. `backend/.gitignore` re-includes this one with `!dist`, because production depends on it.

### Coolify Configuration

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Build pack | Nixpacks |
| Site type | Dynamic (a running Node.js server, not a static site) |
| Base directory | `/part3/3.1-3.11/backend` |
| Watch paths | `part3/3.1-3.11/**` |
| Install command | `npm install` |
| Start command | `npm start` |
| Exposed ports | `3001` |
| Resource limits | 256 MB memory (no swap), 0.5 CPU |

### Verifying a Deployment

1. Open [`/api/persons`](https://fullstackphonebook.msof.me/api/persons). It should return JSON.
2. Open the [live application](https://fullstackphonebook.msof.me/). The phonebook should load.
3. Add, update, and delete a person to confirm the API works end to end.

Every deployment or restart resets the phonebook to its initial data.

## Deployment Architectures

This section compares two common ways to deploy a single-page application with a separate API. It's included for educational purposes.

### Unified Deployment (Same Origin)

One backend process serves both the frontend build and the API. A reverse proxy in front of it handles HTTPS.

```mermaid
flowchart TD
    subgraph browser["Browser (Client)"]
        react["React App<br>(origin: https://example.com)"]
    end

    subgraph server["Backend Host"]
        rproxy["Reverse Proxy Proc<br>(https://example.com)<br>TLS termination"]
        subgraph backend["Backend: Node.js Proc<br>(internal port, e.g., 3001)"]
            subgraph app["Express App"]
                staticmw["Static Middleware<br>(express.static)"]
                routes["API Route Handlers<br>(/api/*)"]
            end
            memory["In-Memory Data<br>(persons array)"]
        end
        files["Frontend Build Output<br>(backend/dist)"]
    end

    browser -->|"1. Requests page &<br>bundled assets"| rproxy
    rproxy -->|"2. Forwards over HTTP"| staticmw
    staticmw -->|"3. Reads files"| files
    react -->|"4. API requests<br>(https://example.com/api/*)"| rproxy
    rproxy -->|"5. Forwards over HTTP"| routes
    routes -.->|"6. Reads & Writes<br>(in-process)"| memory
```

*Architecture diagram showing the request flow in a unified production deployment. Solid arrows show who initiates each request or file read. Dotted arrows show in-process data access. The React app and the API share the origin `https://example.com`, so no CORS is needed. `backend/dist` is generated by `npm run build:frontend`.*

> **Note:** This app uses the unified deployment. The [architecture diagram in the Production section](#architecture) shows how the generic roles in this diagram map to the actual hosting setup.

### Split Deployment (Cross-Origin)

The frontend build is hosted on a static host or CDN, and the API runs on a separate domain.

```mermaid
flowchart TD
    subgraph browser["Browser (Client)"]
        react["React App<br>(origin: https://example.com)"]
    end

    subgraph statichost["Static Host / CDN<br>(https://example.com)"]
        files["Frontend Build Output"]
    end

    subgraph server["Backend Host"]
        rproxy["Reverse Proxy Proc<br>(https://backend.example.com)<br>TLS termination"]
        subgraph backend["Backend: Node.js Proc<br>(internal port, e.g., 3001)"]
            subgraph app["Express App"]
                corsmw["CORS Middleware<br>(cors package)"]
                routes["API Route Handlers<br>(/api/*)"]
            end
            memory["In-Memory Data<br>(persons array)"]
        end
    end

    browser -->|"1. Requests page &<br>bundled assets"| files
    react -->|"2. API requests<br>(https://backend.example.com/api/*)"| rproxy
    rproxy -->|"3. Forwards over HTTP"| corsmw
    corsmw -->|"4. next()"| routes
    routes -.->|"5. Reads & Writes<br>(in-process)"| memory
```

*Architecture diagram showing the request flow in a split production deployment. Solid arrows show who initiates each request. Dotted arrows show in-process data access. The CORS middleware adds CORS headers to responses, and the browser enforces them. Preflight (`OPTIONS`) requests are answered by the CORS middleware and never reach the route handlers. The backend URL is set at build time via `VITE_API_URL`.*
