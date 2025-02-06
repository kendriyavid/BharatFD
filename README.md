# BharatFD Backend

## Overview
This repository contains the backend service for **BharatFD**, handling user authentication, FAQ management, caching, and translations. The backend is built with **Node.js**, **Express.js**, and **MongoDB**, with **Redis** for caching and **Docker** for easy deployment.

Deployed Link: https://bharatfrontend.onrender.com/

Frontend Repo Link: https://github.com/kendriyavid/bharatfrontend

## Features
- **JWT Authentication** for secure access
- **MongoDB Atlas** as the cloud database
- **Redis Caching** for optimized FAQ management
- **Docker Support** for containerized deployment
- **Google Translate API** for dynamic WYSIWYG content translation
- **CORS Configured** to allow frontend communication
- **Jest Testing** Ensures reliable and maintainable code by testing application functionality.


## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) (for containerized deployment)
- [Redis](https://redis.io/) (if not using Docker, ensure a Redis instance is running)
- [MongoDB Atlas](https://www.mongodb.com/) (or local MongoDB instance)

## Quick Start

> **⚠️ Note:** `npm install` may take longer than usual because `mongodb-memory-server` (a large package) is installed for testing.  
> To speed up the process, consider removing the dev dependencies from `package.json`.

Clone the repository and navigate into the project directory:
```sh
 git clone <repository-url>
 cd <repository-directory>
```

## Environment Variables
Create a `.env` file in the root directory and set the following values:
```sh
DATABASE_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/your-database?retryWrites=true&w=majority
JWT_SECRET=your-jwt-secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Running the Application
### With Docker
Run the application using Docker Compose:
```sh
 npm install
 docker compose up -d
```
Access the backend at `http://localhost:3000`

### Without Docker
> **⚠️ Note:** you will need a redis instance either in cloud or docker
Manually install dependencies and start the server:
```sh
 npm install
 npm start
```

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | `/api/faqs` | Fetch all FAQs |
| POST   | `/api/faqs` | Create a new FAQ |
| PUT    | `/api/faqs/:id` | Update an FAQ |
| DELETE | `/api/faqs/:id` | Delete an FAQ |

## Admin Setup
To create an admin account, run:
```sh
node ./utils/adminCreator.js
```

## Architecture

## WYSIWYG Translation Strategy
The application translates HTML-based content dynamically using `HTMLtranslate.js`.
### Workflow:
1. **Parse HTML** into a DOM tree using `JSDOM`.
2. **Extract text** while preserving HTML structure.
3. **Replace text** with placeholders (`${1}, ${2}, ...`).
4. **Send text** to Google Translate API.
5. **Replace placeholders** with translated text while keeping HTML intact.
6. **Return fully translated HTML.**

### Error Handling
- If translation fails, the original text is retained.
- Unexpected errors are logged to the console.

  ## Example
<img src="https://github.com/user-attachments/assets/890d6e6f-516b-4e5c-954e-3ca53001124b" width="400" height="450">


## Caching Strategy for FAQ Management
To optimize performance and reduce database queries, Redis is used as a caching layer.

### 1. FAQ ID Caching
- **Key:** `faqIds:en`
- **Purpose:** Stores a list of all FAQ IDs to reduce MongoDB queries.
- **Update Mechanism:**
  - Refreshed when an FAQ is added or deleted.

### 2. FAQ Response Caching
- **Key Format:** `faq:{faqId}:response:{lang}`
- **Purpose:** Caches individual FAQ responses, including translated versions.
- **Workflow:**
  - On request, Redis is checked first.
  - If cache miss, data is retrieved from MongoDB and stored in Redis.
  - Translated responses are cached separately to minimize API calls.

### 3. Cache Invalidation
- **Triggers:**
  - When an FAQ is updated, cached responses are removed.
  - When an FAQ is deleted, all translations are cleared.
- **Mechanism:**
  - Redis `keys` command is used to find relevant cache keys.
  - `del` command removes outdated cache entries.
- **TTL (Time-to-Live):**
  - Cached responses expire after a predefined time to ensure data freshness.
