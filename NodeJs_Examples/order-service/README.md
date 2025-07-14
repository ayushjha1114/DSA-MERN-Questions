# Order Service - Kafka Event Creator

This service creates Kafka events.

---

## Docker Commands

### Build the Docker Image

```bash
docker build -t order-service .
```

### Run the Order Service Container

```bash
docker run --network infra-kafka-docker_kafka-net -p 3001:3001 --env-file .env order-service
```

> The above command runs the order service in the `kafka-net` network (shared with other repositories).

---

## Troubleshooting

If you encounter the following error:

```
docker: Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint suspicious_boyd (...): Bind for 0.0.0.0:3001 failed: port is already allocated
```

Follow these steps:

1. **Find the container ID:**
    ```bash
    docker ps
    ```

2. **Stop the running container:**
    ```bash
    docker stop <order-service-container-id>
    ```

3. **Remove the stopped container:**
    ```bash
    docker rm <order-service-container-id>
    ```

4. **Rebuild and rerun the container:**
    ```bash
    docker build -t order-service .
    docker run --network infra-kafka-docker_kafka-net -p 3001:3001 --env-file .env order-service
    ```

---

## Example: Run the Order API

You can use `curl` to create an order:

```bash
curl --location 'http://localhost:3001/order' \
  --header 'Content-Type: application/json' \
  --data '{"id": "order-106", "item": "face wash", "quantity": 1}'
```