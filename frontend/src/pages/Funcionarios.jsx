import React, { useEffect, useState } from 'react';
import api from '../services/api'
import EmployeeCard from '../components/EmployeeCard';
import Layout from '../components/Layout';
import '../styles/Funcionarios.css';

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: '', cargo: '', telefone: '', ativo: true });

  const carregarFuncionarios = async () => {
    try {
      const res = await api.get('/employees');
      setFuncionarios(res.data.data || res.data);
    } catch (err) {
      console.error('Erro ao buscar funcionários:', err);
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const abrirModal = (func = null) => {
    setEditando(func);
    setForm(func ? { ...func } : { nome: '', cargo: '', telefone: '', ativo: true });
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setEditando(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const salvarFuncionario = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/employees/${editando._id}`, form);
      } else {
        await api.post('/employees', form);
      }
      carregarFuncionarios();
      fecharModal();
    } catch (err) {
      console.error('Erro ao salvar funcionário:', err);
    }
  };

  const deletarFuncionario = async (id) => {
    if (!window.confirm('Deseja realmente excluir este funcionário?')) return;
    try {
      await api.delete(`/employees/${id}`);
      carregarFuncionarios();
    } catch (err) {
      console.error('Erro ao deletar funcionário:', err);
    }
  };

  const filtrados = funcionarios.filter((f) =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.cargo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Layout>
		<div className="funcionarios-container">
		  <div className="funcionarios-header">
			<h2>Funcionárias</h2>
			<button className="btn-novo" onClick={() => abrirModal()}>
			  + Nova Funcionária
			</button>
		  </div>
		  <div className="funcionarios-search">
			<input
			  type="text"
			  placeholder="Buscar por nome, cargo ou especialidade..."
			  value={busca}
			  onChange={(e) => setBusca(e.target.value)}
			/>
			<span>Total: {filtrados.length} funcionárias</span>
		  </div>
		  <div className="funcionarios-lista">
			{filtrados.map((f) => (
			  <EmployeeCard
				key={f._id}
				funcionario={f}
				onEdit={() => abrirModal(f)}
				onDelete={() => deletarFuncionario(f._id)}
			  />
			))}
		  </div>
		  {showModal && (
			<div className="modal-fundo">
			  <div className="modal">
				<h3>{editando ? 'Editar Funcionária' : 'Nova Funcionária'}</h3>
				<form onSubmit={salvarFuncionario}>
				  <label>Nome:</label>
				  <input
					type="text"
					name="nome"
					value={form.nome}
					onChange={handleChange}
					required
				  />
				  <label>Cargo:</label>
				  <input
					type="text"
					name="cargo"
					value={form.cargo}
					onChange={handleChange}
					required
				  />
				  <label>Telefone:</label>
				  <input
					type="text"
					name="telefone"
					value={form.telefone}
					onChange={handleChange}
					required
				  />
				  <div className="ativo-container">
					<label>
					  <input
						type="checkbox"
						name="ativo"
						checked={form.ativo}
						onChange={handleChange}
					  />
					  Ativo
					</label>
				  </div>
				  <div className="modal-acoes">
					<button type="submit" className="btn-salvar">Salvar</button>
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
