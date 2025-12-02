// src/components/AppointmentFormModal.jsx
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import "../styles/Agenda.css"; 


export default function AppointmentFormModal({ open, onClose, onSubmit, initial = null, lists = {}, isEdit = false, conflictChecker }) {
  const { clients = [], employees = [], services = [] } = lists;

  // form state
  const [cliente, setCliente] = useState(initial?.cliente ?? "");
  const [funcionario, setFuncionario] = useState(initial?.funcionario?._id ?? initial?.funcionario ?? "");
  const [servico, setServico] = useState(initial?.servico?._id ?? initial?.servico ?? "");
  const [dataHora, setDataHora] = useState("");
  const [duracaoMinutos, setDuracaoMinutos] = useState(initial?.duracaoMinutos ?? initial?.servico?.duracaoMinutos ?? 30);
  const [status, setStatus] = useState(initial?.status ?? "marcado");
  const [observacoes, setObservacoes] = useState(initial?.observacoes ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    // seed form with initial values when open
    setCliente(initial?.cliente?._id ?? initial?.cliente ?? "");
    setFuncionario(initial?.funcionario?._id ?? initial?.funcionario ?? "");
    setServico(initial?.servico?._id ?? initial?.servico ?? "");
    // dataHora: convert incoming ISO to datetime-local value (yyyy-mm-ddThh:mm)
    if (initial?.dataHora) {
      const d = new Date(initial.dataHora);
      const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,16);
      setDataHora(local);
    } else {
      setDataHora("");
    }
    setDuracaoMinutos(initial?.duracaoMinutos ?? initial?.servico?.duracaoMinutos ?? 30);
    setStatus(initial?.status ?? "marcado");
    setObservacoes(initial?.observacoes ?? "");
    setError("");
  }, [open, initial]);

  if (!open) return null;

  function localToISOWithOffset(localValue) {
    // localValue format "YYYY-MM-DDTHH:mm"
    // create Date using local and return ISO string with timezone offset (toISOString uses Z)
    const d = new Date(localValue);
    return d.toISOString(); // backend accepts ISO; if you prefer offset -03:00 transform accordingly
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!cliente || !funcionario || !servico || !dataHora) {
      setError("Preencha cliente, funcionário, serviço e data/hora.");
      return;
    }

    const payload = {
      dataHora: localToISOWithOffset(dataHora),
      duracaoMinutos: Number(duracaoMinutos),
      cliente,
      funcionario,
      servico,
      status,
      observacoes,
    };

    // conflict check using the provided function (synchronous)
    if (conflictChecker) {
      const conflict = conflictChecker(payload, isEdit ? initial?._id : null);
      if (conflict) {
        setError("Horário indisponível para este funcionário. Escolha outro horário.");
        return;
      }
    }

    try {
      await onSubmit(payload, isEdit ? initial?._id : null);
      onClose();
    } catch (err) {
      setError(err?.message || "Erro ao salvar agendamento.");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? "Editar Agendamento" : "Novo Agendamento"}</h3>
          <button className="btn-icon" onClick={onClose}><FaTimes/></button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <label>
            Cliente
            <select value={cliente} onChange={(e)=>setCliente(e.target.value)} required>
              <option value="">-- selecione --</option>
              {clients.map(c => (
                <option key={c._id} value={c._id}>{c.nome} — {c.telefone}</option>
              ))}
            </select>
          </label>

          <label>
            Funcionário
            <select value={funcionario} onChange={(e)=>setFuncionario(e.target.value)} required>
              <option value="">-- selecione --</option>
              {employees.map(f => (
                <option key={f._id} value={f._id}>{f.nome} — {f.cargo}</option>
              ))}
            </select>
          </label>

          <label>
            Serviço
            <select value={servico} onChange={(e)=>setServico(e.target.value)} required>
              <option value="">-- selecione --</option>
              {services.map(s => (
                <option key={s._id} value={s._id}>{s.nome} — R$ {s.preco ?? "0"}</option>
              ))}
            </select>
            {services.length === 0 && <small className="muted">Nenhum serviço listado; se necessário, escolha via agendamentos existentes.</small>}
          </label>

          <label>
            Data e Hora
            <input
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              required
            />
          </label>

          <label>
            Duração (min)
            <input type="number" min="5" value={duracaoMinutos} onChange={(e)=>setDuracaoMinutos(e.target.value)} />
          </label>

          <label>
            Status
            <select value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="marcado">marcado</option>
              <option value="confirmado">confirmado</option>
              <option value="em andamento">em andamento</option>
              <option value="cancelado">cancelado</option>
            </select>
          </label>

          <label>
            Observações
            <textarea value={observacoes} onChange={(e)=>setObservacoes(e.target.value)} rows={3}/>
          </label>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-muted" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{isEdit ? "Salvar" : "Criar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
