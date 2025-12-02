export const ok = (res, data, meta = {}) => res.status(200).json({
	data, 
	meta
})

export const created = (res, data) => res.status(201).json({ 
	data
})

export const noContent = (res) => res.status(204).send()

export const badRequest = (res, message, errors) => res.status(400).json({
	message,
	errors
})

export const notFound = (res, message = 'Não encontrado') => res.status(404).json({
	message
})