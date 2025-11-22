"use client";

import { useEffect, useState } from "react";

interface StatsProps {
  data: number[];
}

export default function DescriptiveStats({ data }: StatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/v1/descriptive/basic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sample_data: data }),
        });

        if (!response.ok) throw new Error("Error calculando estadísticas");
        
        const result = await response.json();
        setStats(result);
      } catch (err) {
        setError("No se pudieron cargar los cálculos.");
      } finally {
        setLoading(false);
      }
    };

    if (data && data.length > 0) {
      fetchStats();
    }
  }, [data]);

  if (loading) return <div className="text-center p-4">Calculando tablas...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!stats) return null;

  const { summary_stats: s, frequency_table: table } = stats;

  return (
    <div className="mt-8 animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        2. Análisis Descriptivo
      </h3>

      {/* 1. Tarjetas de Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Media (Promedio)" value={s.mean.toFixed(2)} />
        <StatCard label="Mediana" value={s.median.toFixed(2)} />
        <StatCard label="Moda" value={s.mode.join(", ")} />
        <StatCard label="Desviación Estándar" value={s.std_dev.toFixed(4)} />
        <StatCard label="Varianza" value={s.variance.toFixed(4)} />
        <StatCard label="Rango" value={s.range.toFixed(2)} />
        <StatCard label="Mínimo" value={s.min} />
        <StatCard label="Máximo" value={s.max} />
      </div>

      {/* 2. Tabla de Frecuencias */}
      <h4 className="text-lg font-semibold text-gray-700 mb-3">Tabla de Frecuencias</h4>
      <div className="overflow-x-auto shadow-sm rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Int.</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Límites</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Marca (xi)</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Frec. Abs (fi)</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Frec. Acum (Fi)</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Frec. Rel (hi)</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.map((row: any) => (
              <tr key={row.interval_index} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-900 font-medium">{row.interval_index}</td>
                <td className="px-3 py-2 text-gray-600">[{row.lower_limit} - {row.upper_limit})</td>
                <td className="px-3 py-2 text-gray-600">{row.class_mark}</td>
                <td className="px-3 py-2 text-blue-600 font-bold">{row.absolute_freq}</td>
                <td className="px-3 py-2 text-gray-600">{row.cumulative_freq}</td>
                <td className="px-3 py-2 text-gray-600">{row.relative_freq}</td>
                <td className="px-3 py-2 text-gray-600">{row.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Subcomponente simple para las tarjetas
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{label}</div>
      <div className="text-lg font-bold text-gray-900 mt-1">{value}</div>
    </div>
  );
}