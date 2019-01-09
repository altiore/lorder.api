#!/usr/bin/make

docker_compose_bin = docker-compose

.PHONY : help init start stop
.DEFAULT_GOAL := help

help: ## Show help text
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

---------------: ## Development tasks ---------------

init: configs start ## Initialize project
	${docker_compose_bin} exec postgres bash -c "wait-postgres" \
	&& npm install
	@echo "********************************************************************\n\
	* This project was successfully initialized. Let's go to coding :) *\n\
	********************************************************************\n"

configs: ## Create enviroment file if it doesn't exist and fill it default values
	test -s .env || cp .env.example .env \
	&& ./bin/generate-credentials.sh \
	@echo "Environment files have been created. Want to continue with default values? [Y/n]"
	@read line; if [ $$line == "n" ]; then echo Aborting; exit 1 ; fi

start: ## Run project in background
	${docker_compose_bin} up --build -d

stop: ## Stop project
	${docker_compose_bin} stop
