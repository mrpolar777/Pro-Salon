import User from '../models/User.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as apiResponse from '../utils/apiResponse.js'

export const listAll = asyncHandler(async (_req, res) => {
	const items = await User.find().sort({
		createdAt: -1
	})
	return apiResponse.ok(res, items)
})

export const getById = asyncHandler(async (req, res) => {
	const item = await User.findById(req.params.id)
	if (!item) return apiResponse.notFound(res, 'Usuário não encontrado')
	return apiResponse.ok(res, item)
})

export const create = asyncHandler(async (req, res) => {
	const { nome, email, password, role, telefone } = req.body
	if (!nome || !email || !password) return apiResponse.badRequest(res, 'Campos obrigatórios: nome, email, password')

	const exists = await User.findOne({ 
		email
	})
	if (exists) return apiResponse.badRequest(res, 'Email já cadastrado')

	const createdItem = await User.create({
		nome, 
		email,
		password,
		role,
		telefone
	})
	const { password: _, ...safe } = createdItem.toObject()
	return apiResponse.created(res, safe)
})

export const update = asyncHandler(async (req, res) => {
	const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password')

	if (!updated) return apiResponse.notFound(res, 'Usuário não encontrado')

	const safe = updated.toObject ? updated.toObject() : updated
	delete safe.password
	return apiResponse.ok(res, safe)
})

export const remove = asyncHandler(async (req, res) => {
	const deleted = await User.findByIdAndDelete(req.params.id)
	if (!deleted) return apiResponse.notFound(res, 'Usuário não encontrado')
	return apiResponse.noContent(res)
})