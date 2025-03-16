# backend-python

## Rodando local

```bash
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

## Rodando com Docker

```bash
docker build -t backend-python .
docker run -p 5000:5000 backend-python
```
