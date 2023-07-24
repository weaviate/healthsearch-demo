FROM python:3.8

WORKDIR /backend

COPY . /backend

RUN pip install --no-cache-dir -r requirements.txt

RUN chmod +x wait-for-it.sh

RUN chmod +x start.sh

EXPOSE 8000

CMD ["./wait-for-it.sh", "http://weaviate", "--", "./start.sh"]