import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

export default function Dashboard() {
  const [openRow, setOpenRow] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch("http://localhost:4000/dashboard")
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
    fetch(`${API_BASE}/dashboard`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard:", err);
        setLoading(false);
      });
  }, []);

  // ---------- SAFE STATES ----------
  if (loading) {
    return (
      <div className="p-6 text-slate-600 text-center">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-red-600 text-center">
        Failed to load dashboard
      </div>
    );
  }

  // ---------- REQUESTS ----------
  const requests = data.messages || [
    {
      id: 1,
      prompt: "hi",
      status: "success",
      latency: 180,
      tokens: 32,
      timestamp: "10:12:21",
      details: {
        promptTokens: 4,
        completionTokens: 28,
        steps: {
          preprocessing: 20,
          llmCall: 130,
          postprocessing: 15,
          metricsExport: 15,
        },
        cost: "$0.00002",
        errorRate: "0%",
      },
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-slate-800">
        LLM Monitoring Dashboard
      </h2>

      {/* OVERALL METRICS */}
      {data.overall && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric
            title="Total Requests"
            value={data.overall.total_requests}
          />
          <Metric
            title="Avg Latency"
            value={`${data.overall.avg_latency_ms.toFixed(2)} ms`}
          />
          <Metric
            title="Error Rate"
            value={`${data.overall.error_rate.toFixed(2)}%`}
          />
          <Metric
            title="Total Tokens"
            value={data.overall.total_tokens}
          />
        </div>
      )}

      {/* REQUEST TABLE */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Prompt</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Latency</th>
              <th className="px-4 py-3">Tokens</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req, index) => (
              <React.Fragment key={req.id ?? `row-${index}`}>
                <tr className="border-t hover:bg-slate-50 transition">
                  <td className="px-4 py-3 max-w-xs truncate">
                    {req.prompt}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      {req.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {req.latency} ms
                  </td>

                  <td className="px-4 py-3 text-center">
                    {req.tokens}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {req.timestamp}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        setOpenRow(openRow === req.id ? null : req.id)
                      }
                      className="text-slate-600 hover:text-slate-900"
                    >
                      {openRow === req.id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </td>
                </tr>

                {/* EXPANDED ROW */}
                {openRow === req.id && (
                  <tr className="bg-slate-50">
                    <td colSpan="6" className="p-4">
                      <DetailCard details={req.details} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* GRAFANA LINK */}
      <div className="text-sm text-slate-600">
        View real-time metrics in{" "}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline"
        >
          Grafana
        </a>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Metric({ title, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-2xl font-semibold text-slate-800 mt-1">
        {value}
      </p>
    </div>
  );
}

function DetailCard({ details }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold text-slate-800 mb-2">
          Token Usage
        </h4>
        <p className="text-sm">
          Prompt Tokens: {details.promptTokens}
        </p>
        <p className="text-sm">
          Completion Tokens: {details.completionTokens}
        </p>
        <p className="text-sm mt-2">
          Estimated Cost:{" "}
          <span className="font-medium">{details.cost}</span>
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-slate-800 mb-2">
          Latency Breakdown
        </h4>
        <ul className="text-sm space-y-1">
          <li>Preprocessing: {details.steps.preprocessing} ms</li>
          <li>LLM API Call: {details.steps.llmCall} ms</li>
          <li>Postprocessing: {details.steps.postprocessing} ms</li>
          <li>Metrics Export: {details.steps.metricsExport} ms</li>
        </ul>
      </div>
    </div>
  );
}
