const express = require('express');
var cors = require('cors')
const conectarDB = require('./config/db');

//crear servidor
const app = express();

//conectar a la base de datos
conectarDB();

//habilitar cors
app.use(cors())

//habilitar express.json
app.use(express.json({ extend: true }));

//puerto de la app
const port = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})