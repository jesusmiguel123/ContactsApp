FROM node:18.13.0-alpine

ENV APP_HOME=/home/app
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
COPY package.json $APP_HOME
RUN npm install
ENV PATH="./node_modules/.bin:$PATH"
COPY . $APP_HOME
ENTRYPOINT sh ./deploy/app.sh
# FROM nginx:1.23.3-alpine

# RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.2.0/envsubst-`uname -s`-`uname -m` -o envsubst
# RUN chmod +x envsubst
# RUN mv envsubst /usr/local/bin
# COPY nginx.config /etc/nginx/nginx.template
# COPY --from=builder /home/app/build /usr/share/nginx/html
# CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]