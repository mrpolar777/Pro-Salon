import React, { useState, useEffect } from "react";
import '../styles/ModalServico.css'

const ModalServico = ({ servicoEdit, onClose, onSave }) => {
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    duracaoMinutos: "",
    ativo: true,
  });

  useEffect(() => {
    if (servicoEdit) setForm(servicoEdit);
  }, [servicoEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-servico">
        <h2>{servicoEdit ? "Editar Serviço" : "Novo Serviço"}</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Preço
            <input
              name="preco"
              type="number"
              value={form.preco}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Duração (minutos)
            <input
              name="duracaoMinutos"
              type="number"
              value={form.duracaoMinutos}
              onChange={handleChange}
              required
            />
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              name="ativo"
              checked={form.ativo}
              onChange={handleChange}
            />
            Ativo
          </label>

          <div className="modal-actions">
            <button type="button" className="cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="salvar">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalServico;
