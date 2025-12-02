import React from "react";

export default function DashboardCard({ title, value, subtitle, icon }) {
  return (
    <div className="kpi-card">
      <div className="kpi-left">
        <div className="kpi-title">{title}</div>
        <div className="kpi-value">{value}</div>
        {subtitle && <div className="kpi-sub">{subtitle}</div>}
      </div>
      <div className="kpi-icon">{icon}</div>
    </div>
  );
}
