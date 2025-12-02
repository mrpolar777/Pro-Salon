// src/components/DaySchedule.jsx
import React from "react";

function makeSlots(startHour = 8, endHour = 18, stepMinutes = 30) {
  const slots = [];
  const today = new Date();
  today.setSeconds(0);
  today.setMilliseconds(0);
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      const slot = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m, 0, 0);
      slots.push(slot);
    }
  }
  return slots;
}

function findAppointmentForSlot(slot, appointments) {
  if (!appointments) return null;
  return appointments.find((a) => {
    const start = new Date(a.dataHora);
    const end = new Date(start.getTime() + (a.duracaoMinutos || (a.servico?.duracaoMinutos || 30)) * 60000);
    return slot.getTime() >= start.getTime() && slot.getTime() < end.getTime();
  });
}

function formatHour(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DaySchedule({ appointments }) {
  const slots = makeSlots(8, 18, 30); // 30-min slots
  const now = new Date();

  return (
    <div className="day-schedule">
      {slots.map((slot) => {
        const appt = findAppointmentForSlot(slot, appointments);
        const isNow = now >= slot && now < new Date(slot.getTime() + 30 * 60000);
        const className = appt
          ? `slot slot-booked slot-${appt.status}`
          : "slot slot-available";
        return (
          <div key={slot.toISOString()} className={isNow ? `${className} slot-now` : className}>
            <div className="slot-time">{formatHour(slot)}</div>
            <div className="slot-content">
              {appt ? (
                <>
                  <div className="slot-client">{appt.cliente?.nome}</div>
                  <div className="slot-service">{appt.servico?.nome}</div>
                </>
              ) : (
                <div className="slot-free">Disponível</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
