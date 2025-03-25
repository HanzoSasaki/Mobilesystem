const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Usuário do MySQL
    password: "246851", // Senha do MySQL
    database: "estoque"
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err);
        return;
    }
    console.log("Conectado ao banco de dados!");
});

// Rota para listar produtos
app.get("/produtos", (req, res) => {
    db.query("SELECT * FROM produtos", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Rota para adicionar produto
app.post("/produtos", (req, res) => {
    const { nome, quantidade, preco } = req.body;
    db.query(
        "INSERT INTO produtos (nome, quantidade, preco) VALUES (?, ?, ?)",
        [nome, quantidade, preco],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Produto adicionado!", id: result.insertId });
        }
    );
});

// Rota para atualizar produto
app.put("/produtos/:id", (req, res) => {
    const { nome, quantidade, preco } = req.body;
    const { id } = req.params;
    db.query(
        "UPDATE produtos SET nome = ?, quantidade = ?, preco = ? WHERE id = ?",
        [nome, quantidade, preco, id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Produto atualizado!" });
        }
    );
});

// Rota para deletar produto
app.delete("/produtos/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM produtos WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Produto removido!" });
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000!");
});
