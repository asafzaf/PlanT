#!/bin/bash
# Usage: ./run.sh <command> <environment>
# command: start | stop | restart | down | logs
# environment: dev-local | stage | prod (default: dev-local)

set -e

COMMAND=$1
ENV=${2:-dev-local}   # default environment is dev-local
COMPOSE_FILE="./development/$ENV/docker-compose.yml"

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

case "$COMMAND" in
  start)
    echo "Starting stack with environment: $ENV"
    docker-compose -f "$COMPOSE_FILE" up --build -d
    ;;

  stop)
    echo "Stopping stack with environment: $ENV"
    docker-compose -f "$COMPOSE_FILE" stop
    ;;

  restart)
    echo "Restarting stack with environment: $ENV"
    docker-compose -f "$COMPOSE_FILE" down
    docker-compose -f "$COMPOSE_FILE" up --build -d
    ;;

  down)
    echo "Tearing down stack with environment: $ENV"
    docker-compose -f "$COMPOSE_FILE" down
    ;;

  logs)
    echo "Following logs for environment: $ENV"
    docker-compose -f "$COMPOSE_FILE" logs -f
    ;;

  *)
    echo "Usage: $0 {start|stop|restart|down|logs} [dev-local|stage|prod]"
    echo "Environments: dev-local | stage | prod"
    exit 1
    ;;
esac
