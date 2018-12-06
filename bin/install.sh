#!/usr/bin/env bash

POSTGRESQL=$(which psql)
dbname="altiore_contrib"
testSuffix="_test"

echoSuccess () {
  echo -e "    \e[32m$1\e[0m"
}

createPostgresDatabase () {
  echo -e "\e[32mСоздание базы данных...\e[0m"
  read -r -p "    Название базы данных: (${dbname}): "
  [[ $REPLY ]] && dbname=$REPLY

  userExists=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$dbname'";)

  if [[ $userExists = 1 ]]; then
    echoSuccess "Пользователь '$dbname' существует и будет использован для доступа к базе '$dbname'"
    dbPassword=0
  else
    dbPassword=$(date +%s | sha256sum | base64 | head -c 32 ; echo)
    sudo -u postgres psql -c "create user $dbname;"
    if [ $? -eq 0 ]; then
      echoSuccess "Пользователь '$dbname' успешно создан и будет использован для доступа к базе '$dbname'"
      sudo -u postgres psql -c "alter user $dbname with encrypted password '$dbPassword';"
    else
      echo FAIL
    fi
  fi

  dbExists=$(sudo -u postgres psql -tAc "SELECT 1 from pg_database WHERE datname='$dbname'";)
  if [[ $dbExists = 1 ]]; then
    echoSuccess "База данных '$dbname' существует и будет использована для данного проекта"
  else
    sudo -u postgres psql -c "create database $dbname;"
    if [ $? -eq 0 ]; then
      echoSuccess "Вы успешно создали базу данных '$dbname' для данного проекта"
    else
      echo FAIL
    fi
  fi

  dbExists=$(sudo -u postgres psql -tAc "SELECT 1 from pg_database WHERE datname='$dbname$testSuffix'";)
  if [[ $dbExists == 1 ]]; then
    echoSuccess "База данных '$dbname$testSuffix' существует и будет использована для данного проекта"
  else
    sudo -u postgres psql -c "create database $dbname$testSuffix;"
    if [ $? -eq 0 ]; then
      echoSuccess "Вы успешно создали базу данных '$dbname$testSuffix' для данного проекта"
    else
      echo FAIL
    fi
  fi

  sudo -u postgres psql -c "grant all privileges on database $dbname to $dbname;"
  sudo -u postgres psql -c "grant all privileges on database $dbname$testSuffix to $dbname;"
  sudo -u postgres psql -d $dbname$testSuffix -tAc "ALTER SCHEMA public OWNER TO $dbname;"
  sudo -u postgres psql -d $dbname$testSuffix -tAc "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
  sudo -u postgres psql -d $dbname -tAc "ALTER SCHEMA public OWNER TO $dbname;"
  sudo -u postgres psql -d $dbname -tAc "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

  [ -f .env ] || cp .env.example .env

  [[ $dbPassword == 0 ]] || sed -i "s/wrong-password/$dbPassword/g" .env
  jwtSecret=$(date +%s | sha256sum | base64 | head -c 32 ; echo)
  sed -i "s/wrong-jwt-secret-32-characters/$jwtSecret/g" .env

}

while :; do

  if [[ $POSTGRESQL ]]; then
    createPostgresDatabase
  else
    read -r -p 'postgresql не установлен. Установить? (y/n): ' installPostgres
    if [[ "$installPostgres" == "y" ]]; then
      sudo apt-get update && sudo apt-get install postgresql postgresql-contrib
      # TODO: check port where it was installed!!!
      createPostgresDatabase
    fi
  fi

  read -r -p 'Базовые настройки успешно произведены. Выйти? (y/n): '
  [[ "${REPLY}" == 'y' ]] && break

done
