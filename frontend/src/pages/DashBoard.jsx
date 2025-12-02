// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout"; 
import DashboardCard from "../components/DashboardCard";
import ScheduleList from "../components/ScheduleList";
import DaySchedule from "../components/DaySchedule";
import { fetchAppointments, fetchUsers, fetchEmployees } from "../services/dashboardService";
import { FaCalendarAlt, FaUsers, FaCut, FaDollarSign } from "react-icons/fa";
import "../styles/Dashboard.css";

function isSameLocalDate(aIso, bDate) {
  const a = new Date(aIso);
  return a.getFullYear() === bDate.getFullYear() &&
    a.getMonth() === bDate.getMonth() &&
    a.getDate() === bDate.getDate();
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [aps, us, ems] = await Promise.all([
          fetchAppointments(),
          fetchUsers(),
          fetchEmployees(),
        ]);
        if (!mounted) return;
        setAppointments(aps);
        setUsers(us);
        setEmployees(ems);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const today = useMemo(() => new Date(), []);
  const appointmentsToday = useMemo(
    () => appointments.filter((a) => isSameLocalDate(a.dataHora, today)),
    [appointments, today]
  );

  const agendamentosHojeCount = appointmentsToday.length;
  const clientesCount = users.filter((u) => u.role === "cliente").length;
  const funcionariosAtivosCount = employees.filter((e) => e.ativo === true).length;

  // Receita do mês (fictícia): soma prices de appointments do mês atual
  const receitaMes = useMemo(() => {
    const month = today.getMonth();
    const year = today.getFullYear();
    const total = appointments.reduce((sum, a) => {
      const d = new Date(a.dataHora);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const price = a.servico?.preco || 0;
        return sum + Number(price);
      }
      return sum;
    }, 0);
    return total;
  }, [appointments, today]);

  return (
    <Layout>
      <div className="dashboard-root">
        {loading ? (
          <div className="loading">Carregando dashboard...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <div className="kpi-row">
              <DashboardCard
                title="Agendamentos Hoje"
                value={agendamentosHojeCount}
                subtitle="+8% (semana)"
                icon={<FaCalendarAlt size={28} />}
              />
              <DashboardCard
                title="Clientes Cadastrados"
                value={clientesCount}
                subtitle="+12% (mês)"
                icon={<FaUsers size={28} />}
              />
              <DashboardCard
                title="Funcionárias Ativas"
                value={funcionariosAtivosCount}
                subtitle="+2"
                icon={<FaCut size={28} />}
              />
              <DashboardCard
                title="Receita do Mês"
                value={`R$ ${receitaMes.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                subtitle="+15%"
                icon={<FaDollarSign size={28} />}
              />
            </div>

            <div className="content-row">
              <div className="left-col">
                <div className="card card-list">
                  <div className="card-header">
                    <h3>Agendamentos de Hoje</h3>
                    <a className="see-all" href="#/agenda">Ver todos</a>
                  </div>
                  <ScheduleList appointments={appointmentsToday} />
                </div>
              </div>

              <div className="right-col">
                <div className="card card-schedule">
                  <div className="card-header">
                    <h3>Agenda do Dia</h3>
                  </div>
                  <DaySchedule appointments={appointmentsToday} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
