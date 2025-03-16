FROM python:3.10-slim as base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt 

FROM python:3.10-slim
WORKDIR /app
COPY --from=base /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
# gunicorn é o WSGI HTTP server para Python, que é usado para servir a aplicação Flask em produção.
RUN pip install --no-cache-dir gunicorn
COPY app.py /app/app.py
CMD ["/usr/local/bin/gunicorn", "-b", "0.0.0.0:5000", "app:app"]