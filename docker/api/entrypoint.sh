#!/bin/sh

case "$NODE_ENV" in
    development)
        echo "Running Development Server"
        exec npm run start:docker
        ;;
    test-unit)
        echo "Running Unit Test"
        exec npm run test:unit
        ;;
    test-e2e)
        echo "Running e2e Test"
        exec npm run test:e2e
        ;;
    production)
        echo "Running Production Server"
        exec npm run build
        exec npm run migration:up
        exec npm run start
        ;;

    *)
        echo "No script!"
esac
