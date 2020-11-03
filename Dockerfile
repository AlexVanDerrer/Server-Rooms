FROM node:15.0.1-alpine3.10

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./

RUN npm install pm2 -g

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "pm2-runtime", "server.js" ]
