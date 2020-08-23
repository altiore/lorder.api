FROM node:12.16

WORKDIR /usr/src/app
#USER node

COPY ./package*.json ./
COPY ./ormconfig.js ./
COPY ./nodemon.json ./
COPY ./tsconfig.json ./
COPY ./webpack.config.js ./

RUN npm install

EXPOSE 3000

COPY ./docker/node/docker-node-entrypoint.sh ./docker/node/docker-node-entrypoint.sh
RUN chmod +x ./docker/node/docker-node-entrypoint.sh
ENTRYPOINT ["./docker/node/docker-node-entrypoint.sh"]

#ENTRYPOINT [ "npm", "run", "start:dev"]
