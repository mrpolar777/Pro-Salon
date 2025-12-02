import React, { useEffect, useState } from 'react';
import api from '../services/api'
import ClientCard from '../components/ClientCard';
import '../styles/Clientes.css';
import Layout from '../components/Layout';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    role: 'cliente',
    telefone: '',
  });

  const carregarClientes = async () => {
    try {
      const res = await api.get('/users');
	  const apenasClientes = res.data.data.filter(u => u.role === 'cliente')
      setClientes(apenasClientes);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const abrirModal = (cli = null) => {
    setEditando(cli);
    setForm(
      cli
        ? { ...cli, password: '' } // senha em branco ao editar
        : { nome: '', email: '', password: '', role: 'cliente', telefone: '' }
    );
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setEditando(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const salvarCliente = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/users/${editando._id}`, form);
      } else {
        await api.post('/users', form);
      }
      carregarClientes();
      fecharModal();
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
    }
  };

  const deletarCliente = async (id) => {
    if (!window.confirm('Deseja realmente excluir este cliente?')) return;
    try {
      await api.delete(`/users/${id}`);
      carregarClientes();
    } catch (err) {
      console.error('Erro ao deletar cliente:', err);
    }
  };

  const filtrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Layout>
		<div className="clientes-container">
		  <div className="clientes-header">
			<h2>Clientes</h2>
			<button className="btn-novo" onClick={() => abrirModal()}>
			  + Novo Cliente
			</button>
		  </div>
		  <div className="clientes-search">
			<input
			  type="text"
			  placeholder="Buscar por nome ou e-mail..."
			  value={busca}
			  onChange={(e) => setBusca(e.target.value)}
			/>
			<span>Total: {filtrados.length} clientes</span>
		  </div>
		  <div className="clientes-lista">
			{filtrados.map((c) => (
			  <ClientCard
				key={c._id}
				cliente={c}
				onEdit={() => abrirModal(c)}
				onDelete={() => deletarCliente(c._id)}
			  />
			))}
		  </div>
		  {showModal && (
			<div className="modal-fundo">
			  <div className="modal">
				<h3>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h3>
				<form onSubmit={salvarCliente}>
				  <label>Nome:</label>
				  <input
					type="text"
					name="nome"
					value={form.nome}
					onChange={handleChange}
					required
				  />
				  <label>Email:</label>
				  <input
					type="email"
					name="email"
					value={form.email}
					onChange={handleChange}
					required
				  />
				  {!editando && (
					<>
					  <label>Senha:</label>
					  <input
						type="password"
						name="password"
						value={form.password}
						onChange={handleChange}
						required
					  />
					</>
				  )}
				  <label>Telefone:</label>
				  <input
					type="text"
					name="telefone"
					value={form.telefone}
					onChange={handleChange}
					required
				  />
				  <label>Papel:</label>
				  <select name="role" value={form.role} onChange={handleChange}>
					<option value="admin">Admin</option>
					<option value="cliente">Cliente</option>
				  </select>
				  <div className="modal-acoes">
					<button type="submit" className="btn-salvar">
					  Salvar
					</button>
					<button type="button" className="btn-cancelar" onClick={fecharModal}>
					  Cancelar
					</button>
				  </div>
				</form>
			  </div>
			</div>
		  )}
		</div>
	</Layout>
  );
}
