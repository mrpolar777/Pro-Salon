// src/pages/Agenda.jsx
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import AppointmentFormModal from "../components/AppointmentFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  listAppointments,
  listUsers,
  listEmployees,
  listServices,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/appointmentService";

import { hasConflict } from "../utils/appointments";
import "../styles/Agenda.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function Agenda() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  async function loadAll() {
    setLoading(true);
    try {
      const [aps, us, ems, svs] = await Promise.all([
        listAppointments(),
        listUsers(),
        listEmployees(),
        listServices()
      ]);
      setAppointments(aps);
      setClients(us.filter(u=>u.role === "cliente"));
      setEmployees(ems);
      if (svs.length > 0) setServices(svs);
      else {
        // fallback: extract unique services from appointments
        const uniq = {};
        aps.forEach(a=>{
          if (a.servico && a.servico._id) uniq[a.servico._id] = a.servico;
        });
        setServices(Object.values(uniq));
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados da agenda.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=> { loadAll(); }, []);

  // helper para checar conflito (usa lista de appointments atual)
  function conflictChecker(payload, excludeId = null) {
    // ensure payload has funcionario, dataHora, duracaoMinutos
    return hasConflict(payload, appointments, { excludeId });
  }

  async function handleCreate(payload) {
    // cria no backend e recarrega lista
    const res = await createAppointment(payload);
    await loadAll();
    return res;
  }

  async function handleUpdate(payload, id) {
    const res = await updateAppointment(id, payload);
    await loadAll();
    return res;
  }

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(appt) {
    setEditing(appt);
    setModalOpen(true);
  }

  function askDelete(appt) {
    setToDelete(appt);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    await deleteAppointment(toDelete._id);
    setConfirmOpen(false);
    setToDelete(null);
    await loadAll();
  }

  const sorted = useMemo(()=> {
    return [...appointments].sort((a,b)=> new Date(a.dataHora) - new Date(b.dataHora));
  }, [appointments]);

  return (
    <Layout>
      <div className="agenda-root">
        <div className="agenda-header">
          <h2>Agenda</h2>
          <div>
            <button className="btn btn-primary" onClick={openNew}><FaPlus/> Novo</button>
          </div>
        </div>

        {loading ? <div className="loading">Carregando...</div> : null}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <div className="agenda-table card">
            <table>
              <thead>
                <tr>
                  <th>Data / Hora</th>
                  <th>Cliente</th>
                  <th>Serviço</th>
                  <th>Profissional</th>
                  <th>Duração</th>
                  <th>Status</th>
                  <th>Observações</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(appt => {
                  const d = new Date(appt.dataHora);
                  const dateStr = d.toLocaleDateString();
                  const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute:"2-digit" });
                  const dur = appt.duracaoMinutos ?? appt.servico?.duracaoMinutos ?? "-";
                  return (
                    <tr key={appt._id}>
                      <td>{dateStr} <br/> <span className="time-small">{timeStr}</span></td>
                      <td>{appt.cliente?.nome}</td>
                      <td>{appt.servico?.nome}</td>
                      <td>{appt.funcionario?.nome ?? (appt.funcionario?._id ? appt.funcionario._id : "")}</td>
                      <td>{dur} min</td>
                      <td><span className={`status status-${appt.status}`}>{appt.status}</span></td>
                      <td>{appt.observacoes ?? "-"}</td>
                      <td className="actions">
                        <button className="btn btn-ghost" onClick={()=>openEdit(appt)}><FaEdit/></button>
                        <button className="btn btn-ghost" onClick={()=>askDelete(appt)}><FaTrash/></button>
                      </td>
                    </tr>
                  )
                })}
                {sorted.length === 0 && (
                  <tr><td colSpan={8} className="muted">Nenhum agendamento encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <AppointmentFormModal
          open={modalOpen}
          onClose={()=>setModalOpen(false)}
          onSubmit={async (payload, id) => {
            if (editing) {
              await handleUpdate(payload, id);
            } else {
              await handleCreate(payload);
            }
          }}
          initial={editing}
          isEdit={!!editing}
          lists={{ clients, employees, services }}
          conflictChecker={(payload, excludeId) => conflictChecker(payload, excludeId)}
        />

        <ConfirmDialog
          open={confirmOpen}
          title="Excluir agendamento"
          message={`Deseja remover o agendamento de ${toDelete?.cliente?.nome ?? ""} em ${toDelete ? new Date(toDelete.dataHora).toLocaleString() : ""}?`}
          onConfirm={confirmDelete}
          onCancel={()=>{ setConfirmOpen(false); setToDelete(null); }}
        />
      </div>
    </Layout>
  );
}
