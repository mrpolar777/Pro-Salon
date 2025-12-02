// src/components/ScheduleList.jsx
import React from "react";

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ScheduleList({ appointments }) {
  if (!appointments) return null;
  if (appointments.length === 0) {
    return <div className="list-empty">Nenhum agendamento para hoje.</div>;
  }

  return (
    <div className="schedule-list">
      {appointments.map((a) => (
        <div className="schedule-item" key={a._id}>
          <div className="si-left">
            <div className="client-name">{a.cliente?.nome}</div>
            <div className="service-name">{a.servico?.nome}</div>
          </div>

          <div className="si-right">
            <div className="time">{formatTime(a.dataHora)}</div>
            <div className={`status status-${a.status}`}>{a.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
