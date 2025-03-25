FROM node:alpine as build-stage

RUN npm install -g pnpm

ENV VITE_REQUEST_URL=https://api.tftmeta.co.kr/api

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM nginx:alpine as production-stage

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html
