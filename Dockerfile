FROM node:16

RUN mkdir -p /Node-Bulletin-Board
WORKDIR /Node-Bulletin-Board

COPY /package*.json ./

RUN npm install

COPY . .
