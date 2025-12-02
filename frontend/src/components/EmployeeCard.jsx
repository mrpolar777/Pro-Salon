import React from 'react';
import '../styles/Funcionarios.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function EmployeeCard({ funcionario, onEdit, onDelete }) {
  return (
    <div className="employee-card">
      <div className="employee-header">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(funcionario.nome)}&background=ffb6c1&color=fff`}
          alt={funcionario.nome}
          className="employee-avatar"
        />
        <div>
          <h4>{funcionario.nome}</h4>
          <p className="cargo">{funcionario.cargo}</p>
          <span className={`status ${funcionario.ativo ? 'ativo' : 'inativo'}`}>
            {funcionario.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      <div className="employee-body">
        <p><strong>Telefone:</strong> {funcionario.telefone}</p>
        <p><strong>Comissão:</strong> {(funcionario.comissao || 0)}%</p>
      </div>

      <div className="employee-actions">
        <button onClick={onEdit} title="Editar"><FaEdit /></button>
        <button onClick={onDelete} title="Excluir"><FaTrash /></button>
      </div>
    </div>
  );
}
