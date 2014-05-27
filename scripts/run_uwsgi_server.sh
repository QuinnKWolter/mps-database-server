#!/bin/bash

uwsgi --chdir=/home/mps/mps-database-server \
 --module=mps.wsgi:application  \
 --env DJANGO_SETTINGS_MODULE=mps.settings \
 --socket=127.0.0.1:8090 \
 --processes=32 \
 --harakiri=100 \
 --max-requests=3000 \
 --vacuum \
 --daemonize=/home/mps/log/mps.log \
 --threads 2 \
 --master

