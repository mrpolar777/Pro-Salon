import React from 'react';
import '../styles/Clientes.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ClientCard({ cliente, onEdit, onDelete }) {
  return (
    <div className="client-card">
      <div className="client-header">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            cliente.nome
          )}&background=ffcce0&color=fff`}
          alt={cliente.nome}
          className="client-avatar"
        />
        <div>
          <h4>{cliente.nome}</h4>
          <p className="email">{cliente.email}</p>
          <span className={`role ${cliente.role === 'admin' ? 'admin' : 'cliente'}`}>
            {cliente.role === 'admin' ? 'Admin' : 'Cliente'}
          </span>
        </div>
      </div>

      <div className="client-body">
        <p><strong>Telefone:</strong> {cliente.telefone}</p>
      </div>

      <div className="client-actions">
        <button onClick={onEdit} title="Editar"><FaEdit /></button>
        <button onClick={onDelete} title="Excluir"><FaTrash /></button>
      </div>
    </div>
  );
}
