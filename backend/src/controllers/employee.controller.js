import Employee from '../models/Employee.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created, noContent, notFound, badRequest } from '../utils/apiResponse.js';

export const listAll = asyncHandler(async (_req, res) => {
  const items = await Employee.find().sort({ nome: 1 });
  return ok(res, items);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await Employee.findById(req.params.id);
  if (!item) return notFound(res, 'Funcionário não encontrado');
  return ok(res, item);
});

export const create = asyncHandler(async (req, res) => {
  const { nome, cargo, telefone, ativo } = req.body;
  if (!nome) return badRequest(res, 'Campo obrigatório: nome');

  const createdItem = await Employee.create({ nome, cargo, telefone, ativo });
  return created(res, createdItem);
});

export const update = asyncHandler(async (req, res) => {
  const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return notFound(res, 'Funcionário não encontrado');
  return ok(res, updated);
});

export const remove = asyncHandler(async (req, res) => {
  const deleted = await Employee.findByIdAndDelete(req.params.id);
  if (!deleted) return notFound(res, 'Funcionário não encontrado');
  return noContent(res);
});
