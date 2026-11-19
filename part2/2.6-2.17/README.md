# Phonebook Frontend

## Architecture

```mermaid
flowchart LR
    subgraph filesystem["Filesystem"]
        source["Source Code"]
        db[("Database (db.json)")]
    end

    vitedevserver["Vite Dev Server"]
    
    subgraph browser["Browser"]
        react["React Application"]
    end
    
    api["REST API (json-server)"]

    source -->|Source Files| vitedevserver
    vitedevserver -->|JS Modules| react
    
    react <-->|Data as JSON| api
    api <-->|Reads & Writes| db
```

*Arrows show the direction of data flow, not which side initiates the request.*

## Setup

```
npm install
npm run server   # terminal 1 (API on port 3000)
npm run dev      # terminal 2 (frontend on port 5173)
```
