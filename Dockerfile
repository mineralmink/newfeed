FROM node:12

RUN mkdir -p /app/
WORKDIR /app

ADD package*.json /app/
RUN npm ci

ADD . /app/

CMD npm run server

