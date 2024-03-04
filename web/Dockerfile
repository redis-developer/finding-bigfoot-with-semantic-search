FROM node:20 AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/app/dist .
