"use client";
import { API_URL } from '@/config/api';
import { useState, useRef } from "react";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

// --- IMPORTACIONES PARA PDF ---
import { PDFDownloadLink } from '@react-pdf/renderer';
import { HypothesisPDF } from '@/components/reports/HypothesisPDF';
import { toPng } from 'html-to-image';

export default function HypothesisPage() {
  const [activeTab, setActiveTab] = useState<'concepts' | 'lab' | 'code'>('concepts');
  const [testType, setTestType] = useState<'t1' | 't2' | 'anova'>('t1');
  
  // Estados de inputs (Texto para facilitar edición)
  const [inputData1, setInputData1] = useState(""); // Muestra o Grupo 1
  const [inputData2, setInputData2] = useState(""); // Grupo 2
  const [inputData3, setInputData3] = useState(""); // Grupo 3
  const [mu, setMu] = useState("0"); // Valor Hipotético

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // --- LÓGICA PDF ---
  const resultsRef = useRef<HTMLDivElement>(null);
  const [reportImage, setReportImage] = useState<string>("");
  const [preparingPdf, setPreparingPdf] = useState(false);

  const prepareReport = async () => {
    if (resultsRef.current === null) return;
    setPreparingPdf(true);
    try {
        const dataUrl = await toPng(resultsRef.current, { 
            cacheBust: true, 
            backgroundColor: '#ffffff',
            fontEmbedCSS: '', // IMPORTANTE: Evita el error de fuentes de Next.js
        });
        setReportImage(dataUrl);
    } catch (err) {
        console.error("Error capturando imagen", err);
    } finally {
        setPreparingPdf(false);
    }
  };

  // Función auxiliar para convertir "1, 2, 3" en array de números
  const parseData = (str: string) => str.split(",").map(s => Number(s.trim())).filter(n => !isNaN(n));

  // --- PREPARAR DATOS PARA GRÁFICA ---
  const getChartData = () => {
      if (!result) return [];
      
      // La gráfica muestra la comparación visual de las medias
      if (testType === 't1') {
          return [
              { name: 'Muestra', media: result.sample_mean, fill: '#3b82f6' },
              { name: 'Teórico (µ)', media: result.theoretical_mean, fill: '#dc2626' }
          ];
      } else if (testType === 't2') {
          return [
              { name: 'Grupo 1', media: result.mean_group1, fill: '#10b981' },
              { name: 'Grupo 2', media: result.mean_group2, fill: '#f59e0b' }
          ];
      } else if (testType === 'anova') {
          return result.group_means.map((m: number, i: number) => ({
              name: `Grupo ${i+1}`,
              media: m,
              fill: ['#3b82f6', '#10b981', '#f59e0b'][i % 3]
          }));
      }
      return [];
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setReportImage(""); // Limpiar reporte previo al recalcular
    
    let endpoint = "";
    let payload = {};

    try {
        if (testType === 't1') {
            endpoint = "t-test-one";
            const data = parseData(inputData1);
            if (data.length < 2) throw new Error("Se requieren al menos 2 datos.");
            payload = { data, mu: Number(mu) };
        } 
        else if (testType === 't2') {
            endpoint = "t-test-ind";
            const g1 = parseData(inputData1);
            const g2 = parseData(inputData2);
            if (g1.length < 2 || g2.length < 2) throw new Error("Ambos grupos requieren datos.");
            payload = { group1: g1, group2: g2 };
        } 
        else if (testType === 'anova') {
            endpoint = "anova";
            const g1 = parseData(inputData1);
            const g2 = parseData(inputData2);
            const g3 = parseData(inputData3);
            if (g1.length < 2 || g2.length < 2 || g3.length < 2) throw new Error("Se requieren al menos 3 grupos con datos.");
            payload = { groups: [g1, g2, g3] };
        }

        const res = await fetch(`${API_URL}/api/v1/hypothesis/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Error del servidor");
        }
        
        setResult(await res.json());

    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  };

  const pythonCode = `# Pruebas de Hipótesis con Scipy
from scipy import stats

# 1. T-Student (1 muestra) vs media teórica (mu=50)
data = [52, 55, 49, 58, 54]
t_stat, p_val = stats.ttest_1samp(data, 50)

# 2. T-Student (2 muestras independientes)
grupo_A = [85, 88, 90, 92]
grupo_B = [78, 82, 80, 85]
t_stat, p_val = stats.ttest_ind(grupo_A, grupo_B)

# 3. ANOVA (3 grupos)
g1 = [10, 12, 11]
g2 = [15, 18, 16]
g3 = [20, 22, 19]
f_stat, p_val = stats.f_oneway(g1, g2, g3)

print(f"Valor P: {p_val}")
if p_val < 0.05:
    print("Rechazamos H0 (Diferencia Significativa)")`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Módulo 4.3</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Pruebas de Hipótesis</h1>
        <p className="text-gray-500 mt-2">Comparación de medias y análisis de varianza para la toma de decisiones.</p>
      </header>

      {/* Navegación Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button onClick={() => setActiveTab('concepts')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'concepts' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>📖 Conceptos</button>
        <button onClick={() => setActiveTab('lab')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'lab' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>🔬 Laboratorio</button>
        <button onClick={() => setActiveTab('code')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'code' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>💻 Código Python</button>
      </div>

      {/* --- TAB 1: CONCEPTOS --- */}
      {activeTab === 'concepts' && (
        <div className="space-y-8 animate-fade-in">
            {/* Intro Hipótesis */}
            <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-blue-900 mb-3">¿Qué es una Prueba de Hipótesis?</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Es un procedimiento para determinar si existe suficiente evidencia estadística para rechazar una creencia previa sobre una población.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <strong className="text-blue-800 text-xs uppercase">Hipótesis Nula (<InlineMath math="H_0" />)</strong>
                        <p className="text-xs text-gray-600 mt-1">Asume que NO hay efecto o diferencia. Es el status quo. (Ej: <InlineMath math="\mu_1 = \mu_2" />)</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <strong className="text-blue-800 text-xs uppercase">Hipótesis Alterna (<InlineMath math="H_1" />)</strong>
                        <p className="text-xs text-gray-600 mt-1">Lo que queremos probar. Asume que SÍ hay diferencia. (Ej: <InlineMath math="\mu_1 \neq \mu_2" />)</p>
                    </div>
                </div>
            </section>

            {/* T-Student */}
            <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-purple-900 mb-3">Prueba T-Student</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Se utiliza para comparar medias cuando la desviación estándar poblacional es desconocida y la muestra es pequeña (<InlineMath math="n < 30" />).
                </p>
                <div className="bg-purple-50 p-3 rounded-lg mb-2 text-center">
                    <BlockMath math="t = \frac{\bar{x} - \mu}{s / \sqrt{n}}" />
                </div>
            </section>

            {/* ANOVA */}
            <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-green-900 mb-3">ANOVA (Análisis de Varianza)</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Permite comparar las medias de <strong>3 o más grupos</strong> simultáneamente. Evalúa si la varianza <em>entre</em> los grupos es mayor que la varianza <em>dentro</em> de los grupos.
                </p>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                    <BlockMath math="F = \frac{\text{Varianza entre grupos}}{\text{Varianza dentro de grupos}}" />
                </div>
            </section>
        </div>
      )}

      {/* --- TAB 2: LABORATORIO --- */}
      {activeTab === 'lab' && (
        <div>
            {/* Selector de Prueba */}
            <div className="flex justify-center mb-8">
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex">
                    <button onClick={() => { setTestType('t1'); setResult(null); setReportImage(""); }} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${testType === 't1' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>T-Student (1 Muestra)</button>
                    <button onClick={() => { setTestType('t2'); setResult(null); setReportImage(""); }} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${testType === 't2' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>T-Student (2 Muestras)</button>
                    <button onClick={() => { setTestType('anova'); setResult(null); setReportImage(""); }} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${testType === 'anova' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>ANOVA (3+ Grupos)</button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* PANEL DE ENTRADA */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                    <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Datos de Entrada</h3>
                    
                    {testType === 't1' && (
                        <div className="space-y-4">
                            <p className="text-xs text-gray-500">Compara una muestra contra un valor conocido.</p>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Datos Muestra (coma)</label><textarea className="w-full p-2 border rounded bg-gray-50 h-24 text-sm focus:ring-2 focus:ring-purple-500 outline-none" value={inputData1} onChange={e => setInputData1(e.target.value)} placeholder="10, 12, 15..." /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Valor Hipotético (<InlineMath math="\mu" />)</label><input type="number" className="w-full p-2 border rounded bg-gray-50" value={mu} onChange={e => setMu(e.target.value)} /></div>
                        </div>
                    )}

                    {testType === 't2' && (
                        <div className="space-y-4">
                            <p className="text-xs text-gray-500">Compara dos grupos independientes.</p>
                            <div><label className="block text-xs font-bold text-blue-600 mb-1">Grupo 1</label><textarea className="w-full p-2 border rounded bg-gray-50 h-20 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={inputData1} onChange={e => setInputData1(e.target.value)} placeholder="Datos..." /></div>
                            <div><label className="block text-xs font-bold text-green-600 mb-1">Grupo 2</label><textarea className="w-full p-2 border rounded bg-gray-50 h-20 text-sm focus:ring-2 focus:ring-green-500 outline-none" value={inputData2} onChange={e => setInputData2(e.target.value)} placeholder="Datos..." /></div>
                        </div>
                    )}

                    {testType === 'anova' && (
                        <div className="space-y-4">
                            <p className="text-xs text-gray-500">Compara tres o más grupos.</p>
                            <div><label className="block text-xs font-bold text-blue-600 mb-1">Grupo 1</label><input type="text" className="w-full p-2 border rounded bg-gray-50 text-sm" value={inputData1} onChange={e => setInputData1(e.target.value)} placeholder="Datos..." /></div>
                            <div><label className="block text-xs font-bold text-green-600 mb-1">Grupo 2</label><input type="text" className="w-full p-2 border rounded bg-gray-50 text-sm" value={inputData2} onChange={e => setInputData2(e.target.value)} placeholder="Datos..." /></div>
                            <div><label className="block text-xs font-bold text-red-600 mb-1">Grupo 3</label><input type="text" className="w-full p-2 border rounded bg-gray-50 text-sm" value={inputData3} onChange={e => setInputData3(e.target.value)} placeholder="Datos..." /></div>
                        </div>
                    )}

                    {error && <div className="text-red-500 text-xs mt-4 font-bold">{error}</div>}

                    <button onClick={handleCalculate} disabled={loading} className="w-full mt-6 bg-gray-900 text-white py-2 rounded-lg font-bold hover:bg-black transition-colors">
                        {loading ? "Calculando..." : "Ejecutar Prueba"}
                    </button>
                </div>

                {/* PANEL DE RESULTADOS */}
                <div>
                    {result ? (
                        <div className="animate-fade-in">
                            
                            {/* ZONA DE BOTONES PDF */}
                            <div className="flex justify-end mb-4 gap-2">
                                {!reportImage ? (
                                    <button onClick={prepareReport} disabled={preparingPdf} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-gray-900 transition-all">
                                        {preparingPdf ? "Procesando..." : "📄 Generar Reporte PDF"}
                                    </button>
                                ) : (
                                    <PDFDownloadLink
                                        document={<HypothesisPDF data={result} testType={testType} chartImage={reportImage} />}
                                        fileName={`Reporte_Hipotesis_${new Date().toISOString().split('T')[0]}.pdf`}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all shadow-md"
                                    >
                                        {/* @ts-ignore */}
                                        {({ loading }) => (loading ? 'Construyendo...' : '⬇️ Descargar PDF')}
                                    </PDFDownloadLink>
                                )}
                            </div>

                            {/* CONTENEDOR A CAPTURAR (ref={resultsRef}) */}
                            <div ref={resultsRef} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500">
                                <h3 className="font-bold text-gray-800 mb-4">Resultados Estadísticos</h3>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <span className="text-xs font-bold text-purple-800 uppercase">Valor P (P-Value)</span>
                                        <div className={`text-2xl font-mono font-bold mt-1 ${result.p_value < 0.05 ? "text-green-600" : "text-red-500"}`}>
                                            {result.p_value.toFixed(5)}
                                        </div>
                                        <div className="text-[10px] text-gray-500 mt-1">
                                            {result.p_value < 0.05 ? "Significativo (< 0.05)" : "No Significativo (> 0.05)"}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Estadístico {testType === 'anova' ? 'F' : 't'}</span>
                                        <div className="text-2xl font-mono font-bold text-gray-800 mt-1">
                                            {result.statistic.toFixed(4)}
                                        </div>
                                    </div>
                                </div>

                                {/* --- VISUALIZACIÓN COMPARATIVA DE MEDIAS (Gráfica de barras) --- */}
                                <div className="h-48 w-full mb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={getChartData()} layout="vertical" margin={{ left: 30 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={80} style={{ fontSize: '10px' }} />
                                            <Tooltip cursor={{fill: 'transparent'}} />
                                            <Bar dataKey="media" barSize={20} name="Media">
                                                {getChartData().map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className={`p-3 rounded-lg text-center text-sm font-bold ${result.p_value < 0.05 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                    {result.interpretation}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl p-10">
                            <span className="text-4xl mb-2">⚖️</span>
                            <p className="text-sm text-center">Selecciona el tipo de prueba e ingresa los datos.</p>
                        </div>
                    )}
                </div>
            </div>
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
                <span className="ml-3 text-gray-400 font-mono text-sm">hipotesis.py</span>
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