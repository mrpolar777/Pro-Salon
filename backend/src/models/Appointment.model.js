import mongoose, { Schema } from "mongoose";

const AppointmenteSchema = new mongoose.Schema(
	{
		dataHora: {
			type: Date,
			required: true
		},
		duracaoMinutos: {
			type: Number,
			default: 60,
			min: 1
		},
		// referencias
		cliente: {
			type: Schema.Types.ObjectId, ref: 'User', 
			required: true
		},
		funcionario: {
			type: Schema.Types.ObjectId, ref: 'Employee',
			required: true
		},
		servico: {
			type: Schema.Types.ObjectId,
			ref: 'Service',
			required: true
		},
		
		status: {
			type: String,
			enum: ['marcado', 'confirmado','concluido','cancelado'],
			default: 'marcado'
		},
		observacao: {
			type: String,
			trim: true
		}
	},{
		timestamps: true
	}
)

export default mongoose.model('Appointment', AppointmenteSchema)