#!/bin/sh

cp -r /usr/src/cache/node_modules/. /usr/src/app/node_modules/

echo "run migration"
#npm run migration:up

echo "start:dev"
npm run start:dev

#echo "migration start"
#npm run migration:up
