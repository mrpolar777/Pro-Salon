import Appointment from "../models/Appointment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ok,
  created,
  noContent,
  notFound,
  badRequest,
} from "../utils/apiResponse.js";

const basePopulate = [
  { path: "cliente", select: "nome email telefone role" },
  { path: "funcionario", select: "nome cargo telefone" },
  { path: "servico", select: "nome preco duracaoMinutos" },
];

export const listAll = asyncHandler(async (req, res) => {
  const { funcionario, cliente, servico, status, de, ate } = req.query;
  const q = {};
  if (funcionario) q.funcionario = funcionario;
  if (cliente) q.cliente = cliente;
  if (servico) q.servico = servico;
  if (status) q.status = status;
  if (de || ate) {
    q.dataHora = {};
    if (de) q.dataHora.$gte = new Date(de);
    if (ate) q.dataHora.$lte = new Date(ate);
  }

  const items = await Appointment.find(q)
    .sort({ dataHora: 1 })
    .populate(basePopulate);

  return ok(res, items);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await Appointment.findById(req.params.id).populate(basePopulate);
  if (!item) return notFound(res, "Agendamento não encontrado");
  return ok(res, item);
});

export const create = asyncHandler(async (req, res) => {
  const {
    dataHora,
    duracaoMinutos,
    cliente,
    funcionario,
    servico,
    status,
    observacoes,
  } = req.body;
  if (!dataHora || !cliente || !funcionario || !servico) {
    return badRequest(
      res,
      "Campos obrigatórios: dataHora, cliente, funcionario, servico"
    );
  }

  const conflito = await hasConflict({
	funcionario, dataHora, duracaoMinutos
  })
  if (conflito) {
	return badRequest(res, 'Já existe um agendamento para esse funcionário nesse horário.')
  }

  const createdItem = await Appointment.create({
    dataHora,
    duracaoMinutos,
    cliente,
    funcionario,
    servico,
    status,
    observacoes,
  });

  const populated = await createdItem.populate([
	{ path: 'cliente', select: 'nome email telefone' },
	{ path: 'funcionario', select: 'nome cargo telefone' },
	{ path: 'servico', select: 'nome preco duracaoMinutos' }
  ]);

  return created(res, populated);
});

export const update = asyncHandler(async (req, res) => {
	const { dataHora, duracaoMinutos, funcionario } = req.body
  
  if (!dataHora && funcionario) {
    const conflito = await hasConflict({
      funcionario,
      dataHora,
      duracaoMinutos: duracaoMinutos || 60,
      ignoreId: req.params.id
    })

    if (conflito) {
      return badRequest(res, 'Conflito de horário: o funcionário ja possui um agendamento nesse horário')
    }
  }

  const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate([
    { path: 'cliente', select: 'nome email telefone' },
    { path: 'funcionario', select: 'nome cargo telefone' },
    { path: 'servico', select: 'nome preco duracaoMinutos' }
  ]);

  if (!updated) return notFound(res, "Agendamento não encontrado");
  return ok(res, updated);
});

export const remove = asyncHandler(async (req, res) => {
  const deleted = await Appointment.findByIdAndDelete(req.params.id);
  if (!deleted) return notFound(res, "Agendamento não encontrado");
  return noContent(res);
});

async function hasConflict({
  funcionario,
  dataHora,
  duracaoMinutos,
  ignoreId = null,
}) {
  const inicio = new Date(dataHora);
  const fim = new Date(inicio.getTime() + duracaoMinutos * 60000);

  const conflict = await Appointment.findOne({
    funcionario,
    _id: { $ne: ignoreId },
    status: { $ne: "cancelado" },
    $expr: {
      $and: [
        { $lt: ["$dataHora", fim] },
        {
          $gt: [
            { $add: ["$dataHora", { $multiply: ["$duracaoMinutos", 60000] }] },
            inicio,
          ],
        },
      ],
    },
  });

  return !!conflict
}
