"use client";

import { useState } from "react";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

import { API_URL } from '@/config/api';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { RegressionPDF } from '@/components/reports/RegressionPDF';
import { toPng } from 'html-to-image';
import { useRef } from 'react';

export default function InferencialPage() {
  const [activeTab, setActiveTab] = useState<'concepts' | 'lab' | 'code'>('concepts');
  const [inputX, setInputX] = useState("");
  const [inputY, setInputY] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const [inputMode, setInputMode] = useState<'manual' | 'file'>('manual');

  const resultsRef = useRef<HTMLDivElement>(null); // Referencia al contenedor de resultados
  const [reportImage, setReportImage] = useState<string>("");
  const [preparingPdf, setPreparingPdf] = useState(false);

  const prepareReport = async () => {
    if (resultsRef.current === null) return;
    setPreparingPdf(true);
    try {
        const dataUrl = await toPng(resultsRef.current, { 
            cacheBust: true, 
            backgroundColor: '#ffffff',
            fontEmbedCSS: '', // IMPORTANTE: Fix para Next.js fonts
        });
        setReportImage(dataUrl);
    } catch (err) {
        console.error("Error capturando imagen", err);
    } finally {
        setPreparingPdf(false);
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError("");
    
    // Parsear datos
    const xData = inputX.split(",").map(s => Number(s.trim())).filter(n => !isNaN(n));
    const yData = inputY.split(",").map(s => Number(s.trim())).filter(n => !isNaN(n));

    if (xData.length !== yData.length) {
        setError(`Error: Las listas tienen tamaños distintos. X tiene ${xData.length} datos, Y tiene ${yData.length}.`);
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/inference/regression`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x_data: xData, y_data: yData })
      });
      
      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Error en el servidor");
      }
      
      setResult({ ...await res.json(), rawX: xData, rawY: yData });
    } catch (e: any) { 
        setError(e.message); 
    } finally { 
        setLoading(false); 
    }
  };

  // Preparar datos para el gráfico
  const chartData = result ? result.rawX.map((x: number, i: number) => ({ x, y: result.rawY[i] })) : [];

  const pythonCode = `# Regresión Lineal con Scipy
from scipy import stats
import numpy as np

# Datos de dos variables
x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 5]

# Calcular regresión (y = mx + b)
# linregress devuelve: pendiente, intercepto, r, p-value, error
slope, intercept, r, p, std_err = stats.linregress(x, y)

print(f"Ecuación: y = {slope:.2f}x + {intercept:.2f}")
print(f"Correlación (r): {r:.4f}")`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">4. Estadística Inferencial</h1>
        <p className="text-gray-500 mt-2">Buscando relaciones y haciendo predicciones (4.1 - 4.4).</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button onClick={() => setActiveTab('concepts')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'concepts' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>📖 Teoría Fundamental</button>
        <button onClick={() => setActiveTab('lab')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'lab' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>🔬 Regresión y Correlación</button>
        <button onClick={() => setActiveTab('code')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'code' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>💻 Código Python</button>
      </div>

      {/* --- TAB 1: CONCEPTOS --- */}
      {activeTab === 'concepts' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* 4.0 Curva Normal */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 text-blue-900">
                <svg width="100" height="60" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M0 55 Q 25 55 35 30 T 50 5 T 65 30 T 100 55" />
                </svg>
             </div>
             <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span>🔔</span> 4.0 La Curva Normal (Distribución Gaussiana)
             </h3>
             <p className="text-gray-600 mb-4 max-w-3xl">
                Es la base de la estadística inferencial. Describe cómo se distribuyen la mayoría de los fenómenos naturales: 
                la mayoría de los datos están cerca del promedio (el centro de la campana), y pocos están en los extremos.
             </p>
             <div className="bg-blue-50 p-4 rounded-xl">
                <ul className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <li className="flex gap-2">✅ <strong>Simetría:</strong> La media, mediana y moda coinciden en el centro.</li>
                    <li className="flex gap-2">
                        ✅ <strong>Regla 68-95-99:</strong> El 95% de los datos está a menos de 2 desviaciones estándar (<InlineMath math="\pm 2\sigma" />) de la media.
                    </li>
                </ul>
             </div>
          </section>

          {/* Grid de Inferencia */}
          <div className="grid md:grid-cols-2 gap-6">
             {/* 4.2 Regresión */}
             <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">4.2 Regresión Lineal</h3>
                <p className="text-xs text-gray-500 mb-3">Modelar matemáticamente la relación entre dos variables.</p>
                <div className="bg-gray-50 p-3 rounded text-center text-gray-700">
                    <BlockMath math="y = mx + b" />
                    <p className="text-[10px] mt-1 text-gray-400">
                        Donde <InlineMath math="m" /> es la pendiente y <InlineMath math="b" /> la intersección.
                    </p>
                </div>
             </section>

             {/* 4.3 Correlación */}
             <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">4.3 Correlación de Pearson (<InlineMath math="r" />)</h3>
                <p className="text-xs text-gray-500 mb-3">Mide qué tan fuerte es la relación lineal.</p>
                <div className="bg-gray-50 p-3 rounded text-center text-gray-700">
                    <InlineMath math="-1 \leq r \leq 1" />
                </div>
                <ul className="text-[10px] text-gray-500 mt-2 pl-4 list-disc space-y-1">
                    <li><InlineMath math="r=1" />: Correlación Positiva Perfecta.</li>
                    <li><InlineMath math="r=0" />: Sin relación lineal.</li>
                    <li><InlineMath math="r=-1" />: Correlación Negativa Perfecta.</li>
                </ul>
             </section>
          </div>
        </div>
      )}

      {/* --- TAB 2: LABORATORIO --- */}
      {activeTab === 'lab' && (
        <div className="space-y-8 animate-fade-in">
           
           {/* Panel de Entrada */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             
             {/* Selector de Modo */}
             <div className="flex justify-center mb-6">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                    <button 
                        onClick={() => setInputMode('manual')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${inputMode === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        ✍️ Manual
                    </button>
                    <button 
                        onClick={() => setInputMode('file')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${inputMode === 'file' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        📂 Excel / CSV
                    </button>
                </div>
             </div>

             {/* Opción A: Manual (Inputs de Texto) */}
             {inputMode === 'manual' && (
                <div className="animate-fade-in">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">Datos Bivariados (X, Y)</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-blue-600 mb-1">Variable Independiente (X)</label>
                            <textarea 
                                className="w-full p-3 border rounded-lg bg-gray-50 font-mono text-sm h-24 focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 1, 2, 3, 4, 5"
                                value={inputX}
                                onChange={(e) => setInputX(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-green-600 mb-1">Variable Dependiente (Y)</label>
                            <textarea 
                                className="w-full p-3 border rounded-lg bg-gray-50 font-mono text-sm h-24 focus:ring-2 focus:ring-green-500"
                                placeholder="Ej: 2, 4, 5, 4, 5"
                                value={inputY}
                                onChange={(e) => setInputY(e.target.value)}
                            />
                        </div>
                    </div>
                    {error && <div className="text-red-500 text-xs mt-2 font-bold text-center">{error}</div>}
                    
                    <button 
                        onClick={handleCalculate}
                        disabled={loading || !inputX || !inputY}
                        className="mt-6 w-full py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black disabled:bg-gray-300 transition-colors"
                    >
                        {loading ? "Calculando..." : "Calcular Regresión"}
                    </button>
                </div>
             )}

             {/* Opción B: Archivo (Carga Automática) */}
             {inputMode === 'file' && (
                <div className="animate-fade-in text-center border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors relative">
                    <input 
                        type="file" 
                        accept=".csv, .xlsx, .xls"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={async (e) => {
                            if (!e.target.files || e.target.files.length === 0) return;
                            
                            const file = e.target.files[0];
                            setLoading(true);
                            setError("");
                            
                            const formData = new FormData();
                            formData.append("file", file);

                            try {
                                const res = await fetch(`${API_URL}/api/v1/inference/upload`, {
                                    method: "POST",
                                    body: formData,
                                });
                                
                                if (!res.ok) {
                                    const errData = await res.json();
                                    throw new Error(errData.detail || "Error al procesar archivo.");
                                }

                                const data = await res.json();

                                setResult({ 
                                    ...data, 
                                    rawX: data.raw_x, 
                                    rawY: data.raw_y 
                                });
                                

                            } catch (err: any) {
                                console.error(err);
                                setError(err.message || "Error de conexión.");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    />
                    <div className="pointer-events-none">
                        <div className="text-4xl mb-2">📈</div>
                        <p className="text-sm font-bold text-gray-700">Sube tu Excel o CSV con 2 columnas</p>
                        <ul className="text-xs text-gray-400 mt-2 space-y-1">
                            <li>• Columna A: Variable X (Independiente)</li>
                            <li>• Columna B: Variable Y (Dependiente)</li>
                        </ul>
                    </div>
                </div>
             )}
           </div>

           {/* Resultados */}
           {result && (
             <div className="animate-fade-in">
                
                {/* --- BOTONES DE REPORTE  */}
                <div className="flex justify-end mb-4 gap-2">
                    {!reportImage ? (
                        <button 
                            onClick={prepareReport}
                            disabled={preparingPdf}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-gray-900 transition-all"
                        >
                            {preparingPdf ? "Procesando..." : "📄 Generar Reporte PDF"}
                        </button>
                    ) : (
                        <PDFDownloadLink
                            document={<RegressionPDF data={result} chartImage={reportImage} />}
                            fileName={`Reporte_Regresion_${new Date().toISOString().split('T')[0]}.pdf`}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all shadow-md"
                        >
                            {/* @ts-ignore */}
                            {({ loading }) => (loading ? 'Construyendo...' : '⬇️ Descargar PDF')}
                        </PDFDownloadLink>
                    )}
                </div>

                {/* --- CONTENEDOR A CAPTURAR (ref={resultsRef}) --- */}
                <div ref={resultsRef} className="grid lg:grid-cols-3 gap-6 bg-white p-4 rounded-xl">
                    
                    {/* Columna Izquierda: Resultados Numéricos */}
                    <div className="lg:col-span-1 space-y-4">
                        {/**/}
                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                            <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">Ecuación de la Recta</h4>
                            <div className="text-xl font-mono font-bold text-blue-900">
                                {result.linear_regression.equation}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                                m (Pendiente): {result.linear_regression.slope.toFixed(4)} <br/>
                                b (Intercepto): {result.linear_regression.intercept.toFixed(4)}
                            </div>
                        </div>

                        <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                            <h4 className="text-xs font-bold text-green-800 uppercase mb-2">Coef. de Correlación</h4>
                            <div className="text-2xl font-bold text-green-900">
                                r = {result.correlation.pearson_r.toFixed(4)}
                            </div>
                            <div className="inline-block px-2 py-1 bg-green-200 text-green-800 text-[10px] font-bold rounded mt-2">
                                {result.correlation.interpretation}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Covarianza:</span>
                                <span className="font-mono font-bold">{result.covariance.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-gray-500">R² (Determinación):</span>
                                <span className="font-mono font-bold">{result.linear_regression.r_squared.toFixed(4)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Gráfico */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-700 mb-4">Gráfico de Dispersión + Línea de Ajuste</h4>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid />
                                    <XAxis type="number" dataKey="x" name="Variable X" />
                                    <YAxis type="number" dataKey="y" name="Variable Y" />
                                    {/* Nota: En el PDF, el Tooltip no sale, pero la gráfica sí */}
                                    <Scatter name="Datos" data={chartData} fill="#2563eb" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-2">
                            La línea de tendencia visualiza la ecuación $y = mx + b$ sobre los puntos dispersos.
                        </p>
                    </div>
                </div>
             </div>
           )}
        </div>
      )}

      {/* --- TAB 3: CÓDIGO --- */}
      {activeTab === 'code' && (
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-3 text-gray-400 font-mono text-sm">regresion_lineal.py</span>
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