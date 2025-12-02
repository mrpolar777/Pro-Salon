// src/services/appointmentService.js
import api from "./api";

// appointments
export async function listAppointments() {
  const res = await api.get("/appointment");
  return res.data?.data || [];
}

export async function getAppointment(id) {
  const res = await api.get(`/appointment/${id}`);
  return res.data?.data || null;
}

export async function createAppointment(payload) {
  const res = await api.post("/appointment", payload);
  return res.data;
}

export async function updateAppointment(id, payload) {
  const res = await api.put(`/appointment/${id}`, payload);
  return res.data;
}

export async function deleteAppointment(id) {
  const res = await api.delete(`/appointment/${id}`);
  return res.data;
}

// auxiliary lists
export async function listUsers() {
  const res = await api.get("/users");
  return res.data?.data || [];
}

export async function listEmployees() {
  const res = await api.get("/employees");
  return res.data?.data || [];
}

export async function listServices() {
  try {
    const res = await api.get("/services");
    return res.data?.data || [];
  } catch (err) {
   
    return [];
  }
}
