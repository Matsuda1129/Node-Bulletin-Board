FROM node:8-alpine

RUN npm install -g nodemon

RUN mkdir -p /Node-Bulletin-Board
WORKDIR /Node-Bulletin-Board

COPY /package*.json ./

COPY / .

RUN npm install

EXPOSE 3000
CMD [ "nodemon"  ]