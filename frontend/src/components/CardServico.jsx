import React from "react";
import '../styles/CardServico.css'

const CardServico = ({ servico, onEdit, onDelete, onView }) => {
  return (
    <div className="card-servico">
      <div className="card-img-container">
        <img
          src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600"
          alt={servico.nome}
        />
        {servico.ativo && <span className="ativo-tag">Ativo</span>}
      </div>
      <div className="card-content">
        <h3>{servico.nome}</h3>
        <p>Duração: {servico.duracaoMinutos} min</p>
        <p>Preço: R$ {servico.preco}</p>
        <div className="card-actions">
          <button className="btn-detalhes" onClick={() => onView(servico)}>
            Ver Detalhes
          </button>
          <button className="btn-editar" onClick={() => onEdit(servico)}>
            Editar
          </button>
          <button className="btn-excluir" onClick={() => onDelete(servico._id)}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardServico;
