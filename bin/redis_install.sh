#!/usr/bin/env bash

sudo apt update
sudo apt install redis-server

echo "please change 'supervised' to 'supervised systemd' in the opened file!"

sudo gedit /etc/redis/redis.conf