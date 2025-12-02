import React, { useEffect, useState } from "react";
import "../styles/Layout.css";
import { FaUserCircle } from "react-icons/fa";
import LogoPrincipal from '../assets/logo.png'
import api from "../services/api";

export default function Header() {
  const [ userName, setUserName ] = useState('')

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get('auth/me')
        const nome = response.data?.data?.nome
        setUserName(nome || "Usuário")
      } catch (error) {
        console.error('Erro ao carregar nome do usuário:', error)
        setUserName("Usuário")
      }
    }

    fetchUser()
  })

  return (
    <header className="header">
      <div>
		<div className="logo">
          <img src={LogoPrincipal} alt="Logo principal" width={371} height={72} loading="lazy"/>
        </div>
	  </div>
      <div className="welcome">
        Bem-vindo, <span>{userName}</span>!
      </div>
      <div className="avatar">
        <FaUserCircle size={24} />
      </div>
    </header>
  );
}
