import express from 'express'
import routes from './routes/index.routes.js'
import notFound from './middlewares/notFound.middleware.js'
import errorHandler from './middlewares/error.middleware.js'
import { dbState } from './config/db.js'
import cors from 'cors'

const app = express()
const url_front = process.env.URL_FRONTEND

// Config do CORS
app.use(cors({
	origin: url_front,
	methods: 'GET, HEAD,PUT,PATCH,POST,DELETE',
	credentials: true
}))

// Middlewares Global
app.use(express.json())

// Rotas da API
app.use('/api/v1', routes)

// Health-check
app.get('/health', (req, res) => {
	res.json({
		status: 'OK',
		env: process.env.NODE_ENV || 'development',
		db: dbState(),
		time: new Date().toISOString(),
	})
})

// 404
app.use(notFound)
app.use(errorHandler)

export default app