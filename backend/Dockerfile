FROM python:3.10.6-alpine

ENV PYTHONUNBUFFERED=1
RUN apk update
RUN apk add --no-cache gcc musl-dev postgresql-dev
RUN pip install -U pip
ENV APP_HOME=/home/app
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
COPY requirements.txt $APP_HOME
RUN pip install -r requirements.txt
COPY . $APP_HOME
# ENTRYPOINT sh ./deploy/app.sh