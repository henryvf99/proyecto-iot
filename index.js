const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 8080;

// Conéctate a la base de datos MongoDB Atlas
const mongoURI = "tu-url-de-conexion-a-mongodb-atlas";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
    console.log("Conexión exitosa a MongoDB Atlas");
});

// Configuración para procesar datos JSON
app.use(bodyParser.json());

// Define el esquema de los datos
const sensorDataSchema = new mongoose.Schema({
    tiempo: String,
    distancia: Number,
});

const SensorData = mongoose.model("SensorData", sensorDataSchema);

app.post("/actualizar", async (req, res) => {
    const hora = req.body.hora;
    const minuto = req.body.minuto;
    const segundo = req.body.segundo;
    const distancia = req.body.distancia;

    // Verifica que tiempo y distancia no sean nulos
    if (hora !== null && minuto !== null && segundo !== null && distancia !== null) {
        const dataHora = `${hora}:${minuto}:${segundo}`;

        // Verifica si la distancia es menor a 5 cm
        if (distancia < 5) {
            try {
                // Verifica si ya existe un registro con la misma fecha y hora
                const existingData = await SensorData.findOne({ tiempo: dataHora });

                if (!existingData) {
                    // Si no existe, guarda los datos en la base de datos
                    const sensorData = new SensorData({
                        tiempo: dataHora,
                        distancia: distancia,
                    });

                    await sensorData.save();
                    console.log(`Datos guardados en MongoDB - Hora: ${dataHora}, Distancia: ${distancia} cm`);
                    res.send("Datos recibidos y guardados correctamente");
                } else {
                    console.log(`Datos no registrados - Ya existe un registro para la hora: ${dataHora}`);
                    res.send("Datos no registrados - Ya existe un registro para esta hora");
                }
            } catch (error) {
                console.error('Error al guardar datos en MongoDB:', error);
                res.status(500).send("Error interno del servidor");
            }
        } else {
            console.log(`Datos no registrados - Distancia mayor o igual a 5 cm`);
            res.send("Datos no registrados - Distancia mayor o igual a 5 cm");
        }
    } else {
        console.log(`Datos no registrados - Tiempo o distancia nulos`);
        res.send("Datos no registrados - Tiempo o distancia nulos");
    }
});

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
