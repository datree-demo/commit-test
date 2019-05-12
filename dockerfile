FROM python:2.7.10

WORKDIR /enforcer

COPY requirements.txt /enforcer
RUN pip install -r requirements.txt

COPY . /enforcer

ADD ./build_tools/rook-config.json /etc/rookout/rook-config.json
RUN mkdir -p /var/log/rookout

CMD ["python", "main.py"]
