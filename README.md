# PlanT Monorepo

MERN stack monorepo with frontend (`app`), backend (`core`), and future microservices (`services`).  
TypeScript, Docker, Nginx, and multi-environment setup (dev, stage, prod).

---

## Folder Structure
```
root/
├─ apps/
│ ├─ app/ # React frontend (Vite + TS)
│ ├─ core/ # Node backend (Express + TS)
│ └─ services/ # Future microservices
├─ shared/ # Shared types, utils, constants
├─ development/ # Docker Compose + env files + scripts
├─ .github/ # Workflows & templates
├─ tsconfig.base.json
└─ run.sh # Start / restart / stop script
```

---

## Development

### Install dependencies
```bash
cd apps/app
npm install

cd ../core
npm install
```

# From repo root
./run.sh dev-local
```