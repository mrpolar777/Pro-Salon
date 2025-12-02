import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },	
    cargo: {
      type: String,
      trim: true,
    },
    telefone: {
      type: String,
      trim: true,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Employee', EmployeeSchema)