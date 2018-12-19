FROM node:8
RUN npm install -g typescript@3.1.3
RUN npm install -g ts-node

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN npm install
COPY . /usr/src/app

EXPOSE 3000

CMD ["ts-node","server.ts"]