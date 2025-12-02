import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Perfil.css";
import Layout from "../components/Layout";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    password: "",
  });

  // Carregar dados do usuário logado
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get("/auth/me");
        const data = response.data.data;
        setUser(data);
        setFormData({
          nome: data.nome,
          email: data.email,
          telefone: data.telefone || "",
          password: "",
        });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Atualizar usuário
  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const response = await api.put(`/users/${user._id}`, formData);
      setUser(response.data.data);
      setEditMode(false);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Não foi possível atualizar o perfil.");
    }
  }

  if (loading) return <div className="perfil-loading">Carregando...</div>;

  if (!user) return <div className="perfil-erro">Usuário não encontrado.</div>;

  return (
    <Layout>
		<div className="perfil-container">
		  <div className="perfil-card">
			<h2>Meu Perfil</h2>
			{!editMode ? (
			  <div className="perfil-info">
				<p><strong>Nome:</strong> {user.nome}</p>
				<p><strong>Email:</strong> {user.email}</p>
				<p><strong>Telefone:</strong> {user.telefone}</p>
				<p><strong>Função:</strong> {user.role}</p>
				<button className="btn-editar" onClick={() => setEditMode(true)}>
				  Editar Perfil
				</button>
			  </div>
			) : (
			  <form onSubmit={handleUpdate} className="perfil-form">
				<label>Nome</label>
				<input
				  type="text"
				  value={formData.nome}
				  onChange={(e) =>
					setFormData({ ...formData, nome: e.target.value })
				  }
				/>
				<label>Email</label>
				<input
				  type="email"
				  value={formData.email}
				  onChange={(e) =>
					setFormData({ ...formData, email: e.target.value })
				  }
				/>
				<label>Telefone</label>
				<input
				  type="text"
				  value={formData.telefone}
				  onChange={(e) =>
					setFormData({ ...formData, telefone: e.target.value })
				  }
				/>
				<label>Nova Senha</label>
				<input
				  type="password"
				  placeholder="Deixe em branco para não alterar"
				  value={formData.password}
				  onChange={(e) =>
					setFormData({ ...formData, password: e.target.value })
				  }
				/>
				<div className="perfil-btns">
				  <button type="submit" className="btn-salvar">
					Salvar Alterações
				  </button>
				  <button
					type="button"
					className="btn-cancelar"
					onClick={() => setEditMode(false)}
				  >
					Cancelar
				  </button>
				</div>
			  </form>
			)}
		  </div>
		</div>
	</Layout>
  );
}
