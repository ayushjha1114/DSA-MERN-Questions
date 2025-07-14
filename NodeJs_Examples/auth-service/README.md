# Auth Service

This repository contains a Node.js-based authentication microservice. It provides user authentication features using JWT and TOTP (Time-based One-Time Password) for enhanced security, and is designed to be used as part of a microservices architecture.

## Features

- User registration and login
- JWT-based authentication
- TOTP-based two-factor authentication (2FA)
- Environment-based configuration
- Dockerized for easy deployment

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/auth-service.git
    cd auth-service
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure environment variables:**
    - Copy `.env.example` to `.env` and update the values as needed.

## Running with Docker

Build the Docker image:
```bash
docker build -t auth-service .
```

Run the container:
```bash
docker run --network infra-kafka-docker_kafka-net -p 3002:3002 --env-file .env auth-service
```

## API Endpoints

- `POST /register` – Register a new user
- `POST /login` – Authenticate a user and receive a JWT
- `POST /totp/setup` – Generate TOTP secret and QR code for user
- `POST /totp/verify` – Verify TOTP code for two-factor authentication

## Example Usage

### Register a User

```bash
curl --location 'http://localhost:3002/auth/register' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "email": "ayush@example.com",
    "password": "secure123"
  }'
```

### Login

```bash
curl --location 'http://localhost:3002/auth/login' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "email": "ayush@example.com",
    "password": "secure123"
  }'
```

### TOTP Setup

This will return QR code data. Use it in your frontend:

```html
<img src="data:image/png;base64,..." />
```

Or in Postman preview: paste the QR value into a browser tab to view the QR code.

```bash
curl --location 'http://localhost:3002/auth/totp/setup' \
  --header 'Content-Type: application/json' \
  --data '{
    "userId": 1
  }'
```

### TOTP Verify

This will return a token upon successful verification.

```bash
curl --location 'http://localhost:3002/auth/totp/verify' \
  --header 'Content-Type: application/json' \
  --data '{
    "userId": 1,
    "token": "730553"
  }'
```
