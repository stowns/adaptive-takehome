# Adaptive ML Takehome

A TypeScript Node.js web application with a completion endpoint, deployed on Kubernetes with CI/CD pipeline.

## Overview

This project includes a web service with:
- POST `/completion` endpoint that accepts a prompt and returns a completion
- GET `/history` endpoint to retrieve completion history (bonus feature)
- GET `/health` endpoint for health checks
- Unit tests with Jest
- TypeScript for type safety
- Docker containerization
- Kubernetes deployment manifests
- GitHub Actions CI/CD pipeline
- Prometheus instrumentation and deployment
- Grafana deployment

## Requirements

- Node.js 18+
- Docker
- Kubernetes (minikube for local testing)
- ollama models available on the host.  `/ollama` by default.

## Quickstack (minikube)
```bash
# Ensure you have at least 3cpu & 14GB available to minikube
npm i
docker build -t stowns/adaptive-takehome:latest .
minikube image load stowns/adaptive-takehome:latest
helm install adaptive-takehome ./helm/adaptive-takehome
kubectl port-forward service/adaptive-takehome 3000:80
```

## Local Development

### Install Dependencies

```bash
npm install
```

### Build the Application

```bash
npm run build
```

### Run the Application

```bash
npm start
```

The server will start on port 3000 (or the port specified in the PORT environment variable).

### Run Tests

```bash
npm test
```

### Development Mode (with TypeScript)

```bash
npm run dev
```

### Development Mode (with auto-reload)

```bash
npm run dev:watch
```

### Test locally with minikube

```bash
# Ensure the image is built and loaded
docker build -t stowns/adaptive-takehome:latest .
minikube image load stowns/adaptive-takehome:latest

# Start minikube
minikube start

# Install the Helm chart
helm install adaptive-takehome ./helm/adaptive-takehome

# port-forward to access locally
kubectl port-forward service/adaptive-takehome 3000:80
kubectl port-forward service/ollama 11434:11434
```

## API Endpoints

### POST /completion

Submit a prompt and receive a completion.

**Request:**
```json
{
  "prompt": "Your prompt here"
}
```

**Response:**
```json
{
  "completion": "Generated completion text"
}
```

### GET /history

Retrieve the history of all completion requests.

**Response:**
```json
{
  "count": 2,
  "history": [
    {
      "prompt": "Hello",
      "completion": "Response",
      "timestamp": "2025-12-04T10:00:00.000Z"
    }
  ]
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Kubernetes Deployment

This project uses Helm for Kubernetes deployment.

### Prerequisites

- Kubernetes cluster (or minikube for local testing)
- Helm 3.x installed
- Load the image into mikikube `minikube image load stowns/adaptive-takehome:latest`

### Deploy with Helm

Install the chart:

```bash
helm install adaptive-takehome ./helm/adaptive-takehome
```

Upgrade the release:

```bash
helm upgrade adaptive-takehome ./helm/adaptive-takehome
```

Uninstall the release:

```bash
helm uninstall adaptive-takehome
```

## CI/CD Pipeline

The GitHub Actions workflow automatically:
1. Runs unit tests
2. Builds Docker image
3. Pushes to Docker Hub
