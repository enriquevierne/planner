const xlsx = require("xlsx");
const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const { get } = require("selenium-webdriver/http");

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

const categories = {
  Pentateuco: ["Genesis", "Exodo", "Levitico", "Numeros", "Deuteronomio"],
  Historicos: ["Josue", "Juizes", "Rute", "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Cronicas", "2 Cronicas", "Esdras", "Neemias", "Ester"],
  Poeticos: ["Jo", "Salmos", "Proverbios", "Eclesiastes", "Cantares de Salomao"],
  "Profetas Maiores": ["Isaias", "Jeremias", "Lamentacoes", "Ezequiel", "Daniel"],
  "Profetas Menores": ["Oseias", "Joel", "Amos", "Obadias", "Jonas", "Miqueias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias"],
  Evangelhos: ["Mateus", "Marcos", "Lucas", "Joao"],
  Historia: ["Atos"],
  "Epistolas Paulinas": ["Romanos", "1 Corintios", "2 Corintios", "Galatas", "Efesios", "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses", "1 Timoteo", "2 Timoteo", "Tito", "Filemom"],
  "Epistolas Gerais": ["Hebreus", "Tiago", "1 Pedro", "2 Pedro", "1 Joao", "2 Joao", "3 Joao", "Judas"],
  Profecia: ["Apocalipse"],
};

// Função para obter a categoria do livro
function getCategory(book) {
  for (let category in categories) {
    if (categories[category].includes(book)) {
      return category;
    }
  }
  return "Unknown"; // Caso o livro não se enquadre em nenhuma categoria
}

const formatterData = (data) => {
  const array = [];
  let count = 1;
  data.forEach((item) => {
    for (let i = 1; i <= item.verse; i++) {
      const obj = {
        id: count++,
        book: item.book,
        chapter: item.chapter,
        verse: i,
        text: "",
        version: "NAA",
        category: getCategory(item.book),
      };
      array.push(obj);
    }
  });
  return array;
};

app.get("/", (req, res) => {
  const wb = xlsx.readFile("books.xlsx");
  const ws = wb.Sheets["table.csv"];
  const data = xlsx.utils.sheet_to_json(ws);
  const result = formatterData(data);
  return res.status(200).send(result);
});

app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});
