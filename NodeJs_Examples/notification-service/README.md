# Email Notification Service

## Running the Container

### 1. Build the Docker Image

```bash
docker build -t notification-service .
```

### 2. Run the Container (Attach to Kafka's Network)

```bash
docker run \
    --name notification-service \
    --network infra-kafka-docker_kafka-net \
    -p 9000:9000 \
    --env-file .env \
    notification-service
```

> **Note:**  
> If a container named `notification-service` already exists (running or exited), remove it first:
>
> ```bash
> docker rm -f notification-service
> ```

---

## Email Setup

Set up your email account at [Mailtrap](https://mailtrap.io/home).

---

## Monitoring

- **Metrics Endpoint:** [http://localhost:9000/metrics](http://localhost:9000/metrics) (raw metrics)
- **Prometheus UI:** [http://localhost:9090](http://localhost:9090)
- **Grafana:** [http://localhost:3000](http://localhost:3000) (login: `admin` / `admin`)

### Grafana Setup

1. Add Prometheus as a data source (`http://prometheus:9090`).
2. Import a dashboard or build one using metrics like:
     - `emails_sent_total`
     - `redis_dlq_queue_size`
     - etc.

