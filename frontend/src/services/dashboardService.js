import api from "./api";

export async function fetchAppointments() {
  const res = await api.get("/appointment");
  return res.data?.data || [];
}

export async function fetchUsers() {
  const res = await api.get("/users");
  return res.data?.data || [];
}

export async function fetchEmployees() {
  const res = await api.get("/employees");
  return res.data?.data || [];
}
