FROM node:18.13.0-alpine

ENV APP_HOME=/home/app
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
COPY package.json $APP_HOME
# RUN npm install
# RUN npm install -g serve
# ENV PATH="./node_modules/.bin:$PATH"