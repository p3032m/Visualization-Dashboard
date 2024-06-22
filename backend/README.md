
---

# Backend Application README

This repository contains the backend application for managing and serving data to a frontend visualization dashboard. The backend is built using Node.js, Express.js, and MongoDB.

## Prerequisites

Before running the backend application, ensure you have the following installed on your system:

- **Node.js**: Version >= 12.0.0
- **npm** or **yarn**: Package managers for Node.js
- **MongoDB**: Install MongoDB on your system. You can download it from [MongoDB Download Center](https://www.mongodb.com/try/download).

## Getting Started

To get a local copy up and running, follow these steps:

### Installation

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

Create a `.env` file in the root directory of the project and define the following environment variables:

```
DATABASE_URL=mongodb://localhost:27017/data

```

### Running the Application

To start the application in development mode with automatic restart on code changes:

```bash
npm run devstart
# or
yarn devstart
```

This will start the backend server at [http://localhost:3000](http://localhost:3000).

### API Endpoints

The backend provides the following API endpoints:

- **GET `/data/getjson`**: Retrieves JSON data from MongoDB.
- **POST `/data/add`**: Adds a single data entry to MongoDB.
- **POST `/data/addmulti`**: Adds multiple data entries to MongoDB.

### Dependencies

- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Mongoose**: MongoDB object modeling tool designed to work in an asynchronous environment.
- **Cors**: Middleware for Express.js to enable Cross-Origin Resource Sharing (CORS).
- **dotenv**: Zero-dependency module that loads environment variables from a `.env` file into `process.env`.

### Viewing API Responses

Install the "REST Client" extension in Visual Studio Code to directly view and test API responses from the `.rest` or `.http` files.