
from flask import Flask, Blueprint, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///estoque.db"

db = SQLAlchemy(app)

class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)


api = Blueprint('api', __name__, url_prefix='/api')

@api.route("/produtos", methods=["GET"])
def listar_produtos():
    produtos = Produto.query.all()
    produtos_json = [{"id": p.id, "nome": p.nome, "quantidade": p.quantidade} for p in produtos]
    return jsonify(produtos_json)

@api.route("/produtos", methods=["POST"])
def adicionar_produto():
    data = request.json
    novo_produto = Produto(nome=data["nome"], quantidade=data["quantidade"])
    db.session.add(novo_produto)
    db.session.commit()
    return jsonify({"mensagem": "Produto adicionado!"})

app.register_blueprint(api)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5000)