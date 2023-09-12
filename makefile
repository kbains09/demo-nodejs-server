# Makefile for Advanced Task Management Application with GCP

# Variables
NODE_MODULES = ./node_modules
SRC_DIR = ./src
BUILD_DIR = ./build
ENV_FILE = .env
DOCKERFILE = Dockerfile

# Replace the following placeholders with your GCP project information
GCP_PROJECT = your-gcp-project
GKE_CLUSTER = your-gke-cluster
GKE_ZONE = your-gke-zone
GCR_REGISTRY = gcr.io/$(GCP_PROJECT)
K8S_NAMESPACE = task-app
K8S_DEPLOYMENT = task-app-deployment
K8S_SERVICE = task-app-service
FIRESTORE_COLLECTION = tasks

# Set default environment variables
export NODE_ENV ?= development
export PORT ?= 3000

# Default target
all: install build start

# Install project dependencies
install:
	@echo "Installing dependencies..."
	npm install

# Build the application
build:
	@echo "Building the application..."
	npm run build 

# Start the development server
start:
	@echo "Starting the development server..."
	npm start

# Run linting
lint:
	@echo "Running linting..."
	npm run lint

# Run tests
test:
	@echo "Running tests..."
	npm test

# Clean up generated files
clean:
	@echo "Cleaning up..."
	rm -rf $(NODE_MODULES) $(BUILD_DIR)

# Run the application in production mode
production:
	@echo "Starting the production server..."
	export NODE_ENV=production && npm start

# Deploy the application to GKE
deploy-gke:
	@echo "Deploying the application to GKE..."
	# Authenticate to your GCP account if not already authenticated
	# gcloud auth login
	gcloud container clusters get-credentials $(GKE_CLUSTER) --zone $(GKE_ZONE) --project $(GCP_PROJECT)
	kubectl apply -f kubernetes/deployment.yaml -n $(K8S_NAMESPACE)
	kubectl apply -f kubernetes/service.yaml -n $(K8S_NAMESPACE)

# Expose the application service to the internet
expose-gke-service:
	@echo "Exposing the application service to the internet..."
	kubectl expose deployment $(K8S_DEPLOYMENT) --type=LoadBalancer --port=$(PORT) --target-port=$(PORT) -n $(K8S_NAMESPACE)

# Initialize Firestore database collections
init-firestore:
	@echo "Initializing Firestore database collections..."
	# Replace 'your-bucket-name' with the name of your GCP Cloud Storage bucket
	gcloud firestore import gs://your-bucket-name/initial-data.json --collection=$(FIRESTORE_COLLECTION) --project=$(GCP_PROJECT)

# Help target to display available make targets
help:
	@echo "Available targets:"
	@echo "  - install: Install project dependencies."
	@echo "  - build: Build the application."
	@echo "  - start: Start the development server."
	@echo "  - lint: Run linting."
	@echo "  - test: Run tests."
	@echo "  - clean: Clean up generated files."
	@echo "  - production: Start the production server."
	@echo "  - deploy-gke: Deploy the application to GKE."
	@echo "  - expose-gke-service: Expose the application service to the internet."
	@echo "  - init-firestore: Initialize Firestore database collections."
	@echo "  - help: Display available make targets."

.PHONY: install build start lint test clean production \
	deploy-gke expose-gke-service init-firestore help
