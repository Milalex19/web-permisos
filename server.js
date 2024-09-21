const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'permisos'
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Endpoint para validar usuario y contraseña
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT username, role, password FROM users WHERE username = ?';
    db.query(sql, [username], async (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

        res.json({ username: user.username, role: user.role });
    });
});

// Endpoint para registrar nuevos usuarios
app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;

    // Validación
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        
        db.query(sql, [username, hashedPassword, role], (err, result) => {
            if (err) {
                console.error('Error al registrar el usuario:', err);
                return res.status(500).json({ message: 'Error al registrar el usuario' });
            }
            res.status(201).json({ message: 'Usuario registrado con éxito' });
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
    
});

// Endpoint para crear permisos
app.post('/api/permisos', (req, res) => {
    const { tipoPermiso, tiempoPermiso, horaInicio, horaFin, diaInicio, diaFin, estado } = req.body;
    const sql = 'INSERT INTO permisos (tipo, tiempo, hora_inicio, hora_fin, dia_inicio, dia_fin, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [tipoPermiso, tiempoPermiso, horaInicio, horaFin, diaInicio, diaFin, estado], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Permiso creado con éxito' });
    });
});

// Endpoint para obtener permisos activos
app.get('/api/permisos/activos', (req, res) => {
    const sql = 'SELECT * FROM permisos WHERE estado = "activo"';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

// Endpoint para obtener permisos terminados
app.get('/api/permisos/terminados', (req, res) => {
    const sql = 'SELECT * FROM permisos WHERE estado = "terminado"';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

// Endpoint para análisis de permisos por fecha
app.get('/api/permisos/analisis', (req, res) => {
    const { startDate, endDate } = req.query;
    const sql = `SELECT * FROM permisos WHERE fecha_inicio BETWEEN ? AND ?`;
    db.query(sql, [startDate, endDate], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
