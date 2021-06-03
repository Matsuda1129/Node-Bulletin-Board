FROM node:8-alpine

RUN mkdir -p /Node-Bulletin-Board
WORKDIR /Node-Bulletin-Board

COPY /package*.json ./

RUN apk add --no-cache make gcc g++ python && \
    npm install && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++ python

COPY . .
