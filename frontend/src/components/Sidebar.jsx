import React from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaStore,
  FaMoneyBill,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Layout.css";


export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div>
        

        <ul>
          <li onClick={() => navigate("/dashboard")}>
            <FaHome /> Home
          </li>
          <li onClick={() => navigate("/agenda")}>
            <FaCalendarAlt /> Agenda
          </li>
          <li onClick={() => navigate("/salao")}>
            <FaStore /> Salão
          </li>
          <li onClick={() => navigate("/funcionario")}>
            <FaUser /> Funcionários
          </li>
          <li onClick={() => navigate("/clientes")}>
            <FaUser /> Clientes
          </li>
          <li onClick={() => navigate("/financeiro")}>
            <FaMoneyBill /> Financeiro
          </li>
          <li onClick={() => navigate("/relatorios")}>
            <FaChartBar /> Relatórios
          </li>
          <li onClick={() => navigate("/perfil")}>
            <FaUser /> Perfil
          </li>
        </ul>
      </div>

      <div className="footer">
        <ul>
          <li onClick={logout}>
            <FaSignOutAlt /> Sair
          </li>
          <li>
            <FaInfoCircle /> Ajuda
          </li>
        </ul>
      </div>
    </aside>
  );
}
