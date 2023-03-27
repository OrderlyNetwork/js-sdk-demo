FROM node:18 as build

WORKDIR /app

COPY . .
RUN yarn
RUN yarn build

FROM nginx:1.18-alpine as deploy

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/public .

ENTRYPOINT ["nginx","-g", "deamon off;"]
