FROM reports-base

COPY deploy/supervisord.conf /etc/supervisor/supervisord.conf
COPY . /app
WORKDIR /app

RUN npm install

EXPOSE  9000
CMD "npm start"
