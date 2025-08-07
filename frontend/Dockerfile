FROM node:alpine AS build-stage

RUN npm install -g pnpm

ENV VITE_REQUEST_URL=https://tftmeta.co.kr/api
ENV VITE_RECAPT_KEY=6LesCp0rAAAAAO-XgBQWOagDO7uJaQwQdINcEwxp

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM nginx:alpine AS production-stage

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html
