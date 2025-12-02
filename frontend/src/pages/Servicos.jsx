import React, { useEffect, useState } from "react";
import api from "../services/api";
import CardServico from "../components/CardServico";
import ModalServico from "../components/ModalServico";
import '../styles/Servicos.css'
import Layout from "../components/Layout";

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editServico, setEditServico] = useState(null);

  const loadServicos = async () => {
    try {
      const res = await api.get("/services");
      setServicos(res.data.data || res.data);
    } catch (err) {
      console.error("Erro ao carregar serviços", err);
    }
  };

  useEffect(() => {
    loadServicos();
  }, []);

  const handleSave = async (dados) => {
    try {
      if (editServico) {
        await api.put(`/services/${editServico._id}`, dados);
      } else {
        await api.post("/services", dados);
      }
      loadServicos();
      setShowModal(false);
      setEditServico(null);
    } catch (err) {
      console.error("Erro ao salvar serviço", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este serviço?")) {
      try {
        await api.delete(`/services/${id}`);
        loadServicos();
      } catch (err) {
        console.error("Erro ao excluir serviço", err);
      }
    }
  };

  const filtered = servicos.filter((s) =>
    s.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
		<div className="servicos-container">
		  <div className="servicos-header">
			<h1>Serviços</h1>
			<button
			  className="novo-btn"
			  onClick={() => {
				setEditServico(null);
				setShowModal(true);
			  }}
			>
			  + Novo Serviço
			</button>
		  </div>
		  <input
			className="search-input"
			type="text"
			placeholder="Buscar serviços..."
			value={search}
			onChange={(e) => setSearch(e.target.value)}
		  />
		  <div className="servicos-grid">
			{filtered.map((servico) => (
			  <CardServico
				key={servico._id}
				servico={servico}
				onEdit={(s) => {
				  setEditServico(s);
				  setShowModal(true);
				}}
				onDelete={handleDelete}
				onView={(s) => alert(JSON.stringify(s, null, 2))}
			  />
			))}
		  </div>
		  {showModal && (
			<ModalServico
			  servicoEdit={editServico}
			  onClose={() => {
				setShowModal(false);
				setEditServico(null);
			  }}
			  onSave={handleSave}
			/>
		  )}
		</div>
	</Layout>
  );
};

export default Servicos;
