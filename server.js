import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configuración de Multer para almacenamiento de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 600 * 1024 }, // Limita el tamaño a 600KB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF.'));
        }
    },
});

// Conexión a la base de datos
const { Pool } = pkg;
const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL,
});

pool
    .connect()
    .then((client) => {
        console.log("Conexión a PostgreSQL exitosa");
        client.release();
    })
    .catch((err) => {
        console.error("Error de conexión a PostgreSQL: ", err.message);
    });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta POST para recibir datos del formulario
app.post('/enviar', upload.single('hojaVida'), async (req, res) => {
    try {
        const {
            fechaPostulacion, nombreApellido, nivelEducativo, cargo,
            telefono, genero, Departamento, Ciudad,
            zonaResidencia, barrio, fechaNacimiento, tipoDocumento,
            numeroDocumento, recomendado
        } = req.body;

        const hojaVidaFile = req.file;

        if (!hojaVidaFile) {
            return res.status(400).json({ success: false, message: "La hoja de vida es obligatoria." });
        }

        // Validación de campos requeridos
        if (!fechaPostulacion || !nombreApellido || !nivelEducativo || !telefono || !tipoDocumento || !numeroDocumento) {
            return res.status(400).json({ success: false, message: "Por favor complete todos los campos requeridos." });
        }

        // Consulta para insertar en la base de datos
        const query = `
            INSERT INTO "Postulaciones" (
                "fechaPostulacion", "nombreApellido", "nivelEducativo", cargo,
                telefono, genero, "Departamento", "Ciudad",
                "zonaResidencia", barrio, "fechaNacimiento", "tipoDocumento",
                "numeroDocumento", recomendado, "hojaVida"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `;

        // Ejecución del query
        await pool.query(query, [
            fechaPostulacion,
            nombreApellido,
            nivelEducativo,
            cargo,
            telefono,
            genero,
            Departamento,
            Ciudad,
            zonaResidencia,
            barrio,
            fechaNacimiento,
            tipoDocumento,
            numeroDocumento,
            recomendado,
            hojaVidaFile.path,
        ]);

        // Respuesta al cliente
        res.status(200).json({
            success: true,
            message: "Formulario enviado exitosamente",
            data: {
                fechaPostulacion,
                nombreApellido,
                nivelEducativo,
                cargo,
                telefono,
                genero,
                Departamento,
                Ciudad,
                zonaResidencia,
                barrio,
                fechaNacimiento,
                tipoDocumento,
                numeroDocumento,
                recomendado,
                hojaVida: hojaVidaFile.path,
            },
        });
    } catch (err) {
        console.error("Error al insertar datos en la base de datos: ", err);
        res.status(500).json({
            success: false,
            message: "Error al procesar el formulario",
            error: err.message,
        });
    }
});

// Puerto del servidor
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});