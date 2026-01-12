#!/bin/bash
# Usage: ./run.sh <command> <environment>
# command: start | stop | restart | down | logs
# environment: dev-local | stage | prod (default: dev-local)

set -e

# Build settings (fixes "provenance" hang + enables fast builds)
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
export BUILDX_NO_DEFAULT_ATTESTATIONS=1

COMMAND=$1
ENV=${2:-dev-local}   # default environment is dev-local
COMPOSE_FILE="./development/$ENV/docker-compose.yml"
ENV_FILE="./config/env/$ENV/.env"

# Validate command
if [[ -z "$COMMAND" ]]; then
  echo "Usage: $0 {start|stop|restart|down|logs} [dev-local|stage|prod]"
  exit 1
fi

# Validate environment
if [[ ! "$ENV" =~ ^(dev-local|stage|prod)$ ]]; then
  echo "Error: Invalid environment '$ENV'. Allowed: dev-local, stage, prod"
  exit 1
fi

# Check if docker-compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Error: Compose file $COMPOSE_FILE not found!"
  exit 1
fi

# Check if env file exists (used for ${...} substitution like VITE_REACT_APP_API_URL)
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: Env file $ENV_FILE not found!"
  exit 1
fi

# Use Docker Compose v2 ("docker compose"). If you only have legacy docker-compose installed,
# you can swap these lines back to docker-compose and remove --env-file if unsupported.
DC="docker compose --env-file $ENV_FILE -f $COMPOSE_FILE"

case "$COMMAND" in
  start)
    echo "Starting stack with environment: $ENV"
    $DC up --build -d
    ;;

  stop)
    echo "Stopping stack with environment: $ENV"
    $DC stop
    ;;

  restart)
    echo "Restarting stack with environment: $ENV"
    $DC down
    $DC up --build -d
    ;;

  down)
    echo "Tearing down stack with environment: $ENV"
    $DC down
    ;;

  logs)
    echo "Following logs for environment: $ENV"
    $DC logs -f
    ;;

  *)
    echo "Usage: $0 {start|stop|restart|down|logs} [dev-local|stage|prod]"
    echo "Environments: dev-local | stage | prod"
    exit 1
    ;;
esac
