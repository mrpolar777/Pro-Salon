import mongoose, { mongo } from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    preco: { type: Number, required: true, min: 0 },
    duracaoMinutos: { type: Number, default: 60, min: 1 },
    ativo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
