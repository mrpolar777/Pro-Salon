import mongoose from "mongoose";

export async function connectDB() {
	const uri = process.env.MONGO_URI
	if (!uri) {
		throw new Error('MONGO_URI não está definida no .env')
	}

	try {
		await mongoose.connect(uri, {
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 10000,
			socketTimeoutMS: 45000
		})

		console.log('MongoDB conectado')

		mongoose.connection.on('error', (err) => {
			console.error('Erro no MongoDB:', err.message)
		})

		mongoose.connection.on('disconnected', () => {
			console.warn('MongoDB desconectado')
		})

		process.on('SIGINT', async () => {
			await mongoose.connection.close()
			console.log('Conexão MongoDB encerrada (SIGINT)')
			process.exit(0)
		})
	} catch (error) {
		console.error('Falha ao conectar no MongoDB:', error.message)
		throw error
	}
}

export function dbState() {
	const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
	return stateMap[mongoose.connection.readyState] || 'unknown'
}