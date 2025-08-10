FROM python:3.12

WORKDIR /app

COPY . .

RUN set -eux; \
    apt-get update; \
    apt-get install -y libmariadb-dev; \
    \
    pip install gunicorn; \
    pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
CMD [ "gunicorn", "-b", "0.0.0.0:5000", "-w", "1", "index:app" ]