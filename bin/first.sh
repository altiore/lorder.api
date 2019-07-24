#!/usr/bin/env bash

echo "\n    check .env file..."
ENV_FILE=.env
if [ -f "$ENV_FILE" ]; then
    echo "    $ENV_FILE exist and successfully used"
else
    cp .env.example .env
    echo "    $ENV_FILE file was successfully copied"

    echo "\n    generate credentials if not generated yet"
    bin/generate-credentials.sh
fi

echo "\n    run docker compose up..."
bin/start.sh

echo "\n    run migrations..."
npm run migration:up
npm run migration:test:up

echo "\n \033[0;32m   ...теперь ты можешь использовать права доступа из файла \033[0;31m.env\033[0;32m для доступа к базам\033[0;30m"
echo "\n \033[0;32m   Приложение полностью готово к работе! Запусти команду \033[0;31mnpm start\033[0;32m, чтобы начать работу\033[0;30m"