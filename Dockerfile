FROM node:alpine

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 4500

CMD ["npm","start"]