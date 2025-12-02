export default function errorHandler(err, req, res, next) {
	console.error('Error middleware:', err)
	const status = err.status || 500
	res.status(status).json({
		message: err.message || 'Erro interno do servidor',
		errors: err.errors || undefined,
	})
}