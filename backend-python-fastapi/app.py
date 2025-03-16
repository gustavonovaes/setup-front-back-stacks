
from contextlib import asynccontextmanager
from typing import Annotated
import uvicorn

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select

class Produto(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str = Field(index=True)
    quantidade: int | None = Field(default=None, index=True)

sqlite_url = f"sqlite:///estoque.db"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)
SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

# allow all cors 
@app.middleware("http")
async def add_cors_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    return response

@app.post("/api/produtos")
def criar_produto(produto: Produto, session: SessionDep) -> Produto:
    session.add(produto)
    session.commit()
    session.refresh(produto)
    return produto

@app.get("/api/produtos")
def listar_produtos(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Produto]:
    produtos = session.exec(select(Produto).offset(offset).limit(limit)).all()
    return produtos

@app.get("/api/produtos/{produto_id}/")
def listar_produto(produto_id: int, session: SessionDep) -> Produto:
    produto = session.get(Produto, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto not found")
    return produto

@app.delete("/api/produtos/{produto_id}")
def delete_produto(produto_id: int, session: SessionDep):
    produto = session.get(Produto, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto not found")
    session.delete(produto)
    session.commit()
    return {"ok": True}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
