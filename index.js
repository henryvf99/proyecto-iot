const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8080;
let sensorData = { tiempo: "00:00:00", distancia: 0 };

// Configuración para procesar datos JSON
app.use(bodyParser.json());

// Ruta para recibir datos POST en formato JSON
app.post("/actualizar", (req, res) => {
  const hora = req.body.hora;
  const minuto = req.body.minuto;
  const segundo = req.body.segundo;
  const distancia = req.body.distancia;
  const dataHora = `${hora}:${minuto}:${segundo}`;

  sensorData = { tiempo: dataHora, distancia: distancia };

  // Puedes hacer lo que quieras con los datos aquí
  console.log(`Datos recibidos - Hora: ${dataHora}, Distancia: ${distancia} cm`);

  // Responde con una respuesta simple
  res.send("Datos recibidos correctamente");
});

// Ruta para mostrar una página HTML simple
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/datos", (req, res) => {
  // Devuelve los datos del sensor en formato JSON
  res.json(sensorData);
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor web iniciado en http://localhost:${port}`);
});
