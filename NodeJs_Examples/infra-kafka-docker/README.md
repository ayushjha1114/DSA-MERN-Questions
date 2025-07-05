# Infra Kafka Using Docker

This repository provides an infrastructure setup for Kafka using Docker.

## Usage

### 1. Create a Docker Network

```sh
docker network create kafka-net
```
Creates a private network to connect `infra-kafka` and other microservices like `order-service`, `notification-service`, etc.

### 2. Restart Containers

```sh
docker compose down -v && docker compose up -d
```
Removes existing running containers and creates new containers again.