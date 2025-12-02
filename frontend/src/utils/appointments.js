// src/utils/appointments.js

// Retorna Date de início/ fim de um appointment (usa duracaoMinutos do objeto ou do servico)
export function getAppointmentInterval(appointment) {
  const start = new Date(appointment.dataHora);
  const dur = Number(appointment.duracaoMinutos ?? appointment.servico?.duracaoMinutos ?? 30);
  const end = new Date(start.getTime() + dur * 60000);
  return { start, end };
}

// retorna true se intervalos se sobrepõem
export function intervalsOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// testa se o novoAppointment (obj com dataHora, duracaoMinutos, funcionario) conflita com qualquer appointment da lista
// opcionalmente passa excludeId para ignorar o próprio agendamento ao editar
export function hasConflict(newAppt, appointments, { excludeId = null } = {}) {
  const newStart = new Date(newAppt.dataHora);
  const newDur = Number(newAppt.duracaoMinutos ?? newAppt.servico?.duracaoMinutos ?? 30);
  const newEnd = new Date(newStart.getTime() + newDur * 60000);
  return appointments.some((a) => {
    if (excludeId && a._id === excludeId) return false;
    // bloquear por funcionário: se funcionario diferente, ignore
    if (!a.funcionario || !newAppt.funcionario) return false;
    if (String(a.funcionario) !== String(newAppt.funcionario) && String(a.funcionario._id) !== String(newAppt.funcionario)) {
      // a.funcionario pode ser objeto ou id; newAppt.funcionario pode ser id
      // normalize: if either id matches proceed, else skip
      // if not same funcionario → no conflito entre eles
      return false;
    }
    const { start: aStart, end: aEnd } = getAppointmentInterval(a);
    return intervalsOverlap(newStart, newEnd, aStart, aEnd);
  });
}
