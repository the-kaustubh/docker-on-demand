FROM python:3

COPY main.py /

RUN touch /etc/text

CMD [ "/bin/sh", "-c", "python main.py >/etc/text 2>&1" ]
