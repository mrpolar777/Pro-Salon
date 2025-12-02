import Service from '../models/Service.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as apiResponse from '../utils/apiResponse.js'


export const listAll = asyncHandler(async (_req, res) => {
	const items = await Service.find().sort({
		createdAt: -1
	})
	return apiResponse.ok(res, items)
})

export const getById = asyncHandler(async (req, res) => {
	const item = await Service.findById(req.params.id)
	if (!item) return apiResponse.notFound(res, 'Serviço não encontrado')
		return apiResponse.ok(res, item)
})

export const create = asyncHandler(async (req, res) => {
	const { nome, preco, duracaoMinutos, ativo } = req.body
	if (!nome || preco == null) return apiResponse.badRequest(res, 'Campos obrigatórios: nome, preco') 

	const createdItem = await Service.create({
		nome, 
		preco, 
		duracaoMinutos,
		ativo
	})	
	return apiResponse.created(res, createdItem)
})

export const update = asyncHandler(async (req, res) => {
	const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})
	if (!updated) return apiResponse.notFound(res, 'Serviço não encontrado')
		return apiResponse.ok(res, updated)
})

export const remove = asyncHandler(async (req, res) => {
	const deleted = await Service.findByIdAndDelete(req.params.id)
	if (!deleted) return apiResponse.notFound(res, 'Serviço não encontrado')
	return apiResponse.noContent(res)
})