#!/usr/bin/env bash

dbPassword=$(openssl rand -base64 32)
sed -i "s~wrong-password~$dbPassword~g" .env
jwtSecret=$(openssl rand -base64 32)
sed -i "s~wrong-jwt-secret-32-characters~$jwtSecret~g" .env
refreshSecret=$(openssl rand -base64 32)
sed -i "s~wrong-refresh-secret-32-characters~$refreshSecret~g" .env
