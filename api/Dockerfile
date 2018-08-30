FROM reports-base

COPY deploy/supervisord.conf /etc/supervisor/supervisord.conf

### NODE APP ###
COPY . /app
WORKDIR /app
RUN echo $(cat .secret) >> /etc/environment
RUN /bin/bash -c "source /etc/environment"
RUN npm install

### POSRGRESS ###
USER postgres

ENV PATH $PATH:/usr/lib/postgresql/9.5/bin
ENV PGDATA /var/lib/postgresql/data

RUN /etc/init.d/postgresql start &&\
    psql --command "CREATE USER reports_owner WITH SUPERUSER PASSWORD '${PG_PASSWORD}';" &&\
    createdb -O reports_owner reports

RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.5/main/pg_hba.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/9.5/main/postgresql.conf

USER root

### RUN
EXPOSE 5432
EXPOSE  9000

CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
