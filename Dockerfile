FROM node:12.13.1-alpine3.10

WORKDIR /app/
RUN npm install --global yarn@1.19.1

COPY . .

RUN yarn install

EXPOSE 8080

CMD ["yarn", "start:prod"]