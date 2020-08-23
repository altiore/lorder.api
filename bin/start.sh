#!/usr/bin/env bash

echo "\n        checking .env file..."
ENV_FILE=.env
if [ -f "$ENV_FILE" ]; then
    echo "\n \033[0;32m   \033[0;31m$ENV_FILE\033[0;32m exist and successfully used...\033[0;30m"
else
    cp .env.example .env
    echo "\n \033[0;32m   \033[0;31m$ENV_FILE\033[0;32m file was successfully copied...\033[0;30m"

    echo "\n \033[0;32m   generate credentials\033[0;30m"
    bin/generate-credentials.sh
    echo "\n \033[0;32m   ...теперь ты можешь использовать права доступа из файла \033[0;31m$ENV_FILE\033[0;32m для доступа к базам\033[0;30m"
fi

if [ -z `docker ps -q --no-trunc | grep $(docker-compose ps -q postgres)` ]; then
  echo "\n \033[0;32m   starting docker...\033[0;30m"
  docker-compose build --no-cache && docker-compose up

else
  echo "\n \033[0;32m   docker already running...\033[0;30m"
fi
