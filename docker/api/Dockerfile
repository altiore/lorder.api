FROM node:12.16

WORKDIR /usr/src/app

COPY ./bin/* ./bin/
COPY ./altiore*.json ./
COPY ./jest*.js ./
COPY ./nodemon.json ./
COPY ./ormconfig.js ./
COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY ./tslint.json ./
COPY ./docker/api/entrypoint.sh ./docker/api/entrypoint.sh

RUN npm install --ignore-scripts
