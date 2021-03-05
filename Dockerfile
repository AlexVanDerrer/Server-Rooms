FROM node:15.0.1-alpine3.10

RUN mkdir -p /home/vanderrer/node/app/node_modules

WORKDIR /home/vanderrer/node/app

COPY package*.json ./

RUN npm install pm2 -g

RUN npm install

EXPOSE 8080

CMD [ "pm2-runtime", "start" ]
