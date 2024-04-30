FROM node:18-bookworm-slim

RUN apt-get update
RUN apt-get install -y python3 make g++

WORKDIR /home/node/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile
RUN yarn cache clean

WORKDIR /home/node/app/packages/server
COPY packages/server/package.json .
COPY packages/server/yarn.lock .

WORKDIR /home/node/app/packages/client
COPY packages/client/package.json .
COPY packages/client/yarn.lock .

WORKDIR /home/node/app/packages/server
RUN yarn install --frozen-lockfile

WORKDIR /home/node/app/packages/client
RUN yarn install --frozen-lockfile

WORKDIR /home/node/app

RUN rm -rf /root/.cache/Cypress

COPY . .

# USER node
