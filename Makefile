#!/usr/bin/make

docker_compose_bin = docker-compose

.PHONY : help init start stop
.DEFAULT_GOAL := help

help: ## Показать помощь
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

---------------: ## Скрипты для разработки ---------------

init: ## Заново инициализировать приложение. Первый старт или если нужно пересобрать приложение
	chmod +x bin/start.sh \
	&& ./bin/start.sh \
	@echo "Initial..."

start: ## Запустить версию для разработки
	${docker_compose_bin} up

stop: ## Остановить
	${docker_compose_bin} stop

it: ## Войти внутрь главного контейнера (например, для запуска тестов и миграций)
	docker exec -it lorder_server /bin/bash

gen: ## Заново сгенерировать файл конфигурации
	test -s .env || cp .env.example .env \
	&& ./bin/generate-credentials.sh \
	@echo "Environment files have been created. Start application? [Y/n]"
	@read line;\
	if [ $$line = "Y" ]; then\
		make initial;\
	fi
