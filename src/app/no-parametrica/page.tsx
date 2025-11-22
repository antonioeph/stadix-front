"use client";
import { API_URL } from '@/config/api';
import { useState } from "react";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function NonParametricPage() {
  const [activeTab, setActiveTab] = useState<'concepts' | 'lab' | 'code'>('concepts');
  const [inputMatrix, setInputMatrix] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
        // Parsear texto a matriz: "10, 20 \n 30, 40" -> [[10,20], [30,40]]
        const rows = inputMatrix.trim().split("\n");
        const matrix = rows.map(row => 
            row.split(",").map(val => parseInt(val.trim())).filter(n => !isNaN(n))
        ).filter(r => r.length > 0);

        if (matrix.length < 2) throw new Error("Debes ingresar al menos 2 filas.");
        
        // Validar rectitud
        const cols = matrix[0].length;
        if (matrix.some(r => r.length !== cols)) throw new Error("Todas las filas deben tener la misma cantidad de columnas.");

        const res = await fetch(`${API_URL}/api/v1/nonparametric/chi-square`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ observed_data: matrix })
        });

        if (!res.ok) throw new Error("Error en el cálculo del servidor.");
        setResult(await res.json());

    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  };

  const pythonCode = `# Prueba Chi-Cuadrada de Independencia
from scipy.stats import chi2_contingency

# Tabla de contingencia (Matriz de observados)
# Ej: [[Hombres_Afavor, Hombres_EnContra], [Mujeres_Afavor, Mujeres_EnContra]]
tabla = [
    [10, 20],
    [20, 40]
]

chi2, p, dof, expected = chi2_contingency(tabla)

print(f"Estadístico Chi2: {chi2}")
print(f"Valor p: {p}")
if p < 0.05:
    print("Hay relación significativa (Dependencia)")
else:
    print("Son independientes")`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">5. Estadística No Paramétrica</h1>
        <p className="text-gray-500 mt-2">Métodos para datos cualitativos o que no siguen una distribución normal.</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button onClick={() => setActiveTab('concepts')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'concepts' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>📖 Conceptos</button>
        <button onClick={() => setActiveTab('lab')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'lab' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>🔬 Prueba Chi-Cuadrada</button>
        <button onClick={() => setActiveTab('code')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'code' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>💻 Código Python</button>
      </div>

      {/* CONCEPTOS */}
      {activeTab === 'concepts' && (
        <div className="space-y-6 animate-fade-in">
           <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">¿Qué significa "No Paramétrica"?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A diferencia de la estadística paramétrica (que asume que los datos siguen una curva normal), estas pruebas son "libres de distribución". Se usan cuando:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                <li>Los datos son <strong>Cualitativos</strong> (Nominales u Ordinales).</li>
                <li>Hay valores atípicos extremos (Outliers).</li>
                <li>La muestra es muy pequeña.</li>
              </ul>
           </section>

           <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Prueba de Independencia Chi-Cuadrada (<InlineMath math="\chi^2" />)</h3>
              <p className="text-sm text-gray-600 mb-4">
                Determina si existe una relación significativa entre dos variables categóricas. Compara lo que <strong>Observamos</strong> (<InlineMath math="O"/>) en la realidad contra lo que <strong>Esperaríamos</strong> ($E$) si fueran totalmente independientes.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                 <BlockMath math="\chi^2 = \sum \frac{(O_i - E_i)^2}{E_i}" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4 text-xs text-gray-500">
                 <div className="border p-3 rounded bg-gray-50">
                    <strong>Hipótesis Nula (<InlineMath math="H_0"/>):</strong> Las variables son independientes (no tienen relación).
                 </div>
                 <div className="border p-3 rounded bg-gray-50">
                    <strong>Hipótesis Alterna (<InlineMath math="H_1"/>):</strong> Las variables son dependientes (una influye en la otra).
                 </div>
              </div>
           </section>
        </div>
      )}

      {/* LABORATORIO */}
      {activeTab === 'lab' && (
        <div className="space-y-8 animate-fade-in">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="text-sm font-bold text-gray-700 mb-2">Tabla de Contingencia (Matriz)</h3>
             <p className="text-xs text-gray-500 mb-3">Ingresa los conteos separados por comas. Cada línea nueva es una fila de la tabla.</p>
             
             <textarea 
                 className="w-full p-4 border rounded-lg bg-gray-50 font-mono text-sm h-32 focus:ring-2 focus:ring-blue-500"
                 placeholder={`Ejemplo:\n10, 20\n15, 25\n(Fila 1: Grupo A, Fila 2: Grupo B)`}
                 value={inputMatrix}
                 onChange={(e) => setInputMatrix(e.target.value)}
             />
             
             {error && <div className="text-red-500 text-xs mt-2 font-bold">{error}</div>}

             <button 
                onClick={handleCalculate}
                disabled={loading || !inputMatrix.trim()}
                className="mt-4 w-full py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black disabled:bg-gray-300 transition-colors"
             >
                {loading ? "Calculando..." : "Ejecutar Prueba Chi-Cuadrada"}
             </button>
           </div>

           {result && (
             <div className="grid lg:grid-cols-2 gap-6">
                {/* Resultados Estadísticos */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                    <h4 className="font-bold text-gray-800 mb-4">Resultados de la Prueba</h4>
                    
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Estadístico $\chi^2$:</span>
                        <span className="font-mono font-bold text-lg">{result.statistic.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Valor P (p-value):</span>
                        <span className={`font-mono font-bold text-lg ${result.is_significant ? "text-green-600" : "text-gray-600"}`}>
                            {result.p_value.toFixed(4)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">Grados de libertad:</span>
                        <span className="font-mono font-bold">{result.dof}</span>
                    </div>

                    <div className={`p-3 rounded-lg text-sm font-bold text-center ${result.is_significant ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {result.interpretation}
                    </div>
                </div>

                {/* Matriz de Esperados */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-700 mb-4 text-xs uppercase">Frecuencias Esperadas (Teóricas)</h4>
                    <p className="text-xs text-gray-500 mb-4">Estos son los valores que deberías tener si $H_0$ fuera cierta.</p>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center">
                            <tbody>
                                {result.expected_frequencies.map((row: number[], i: number) => (
                                    <tr key={i} className="border-b border-gray-200 last:border-0">
                                        {row.map((val, j) => (
                                            <td key={j} className="p-2 font-mono text-gray-600 bg-white border border-gray-100 m-1">
                                                {val.toFixed(2)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
           )}
        </div>
      )}

      {/* CÓDIGO */}
      {activeTab === 'code' && (
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-3 text-gray-400 font-mono text-sm">chi_cuadrada.py</span>
              </div>
              <button onClick={handleCopy} className="text-xs font-medium text-gray-300 hover:text-white bg-gray-700 px-3 py-1.5 rounded">
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed text-gray-300"><code>{pythonCode}</code></pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}