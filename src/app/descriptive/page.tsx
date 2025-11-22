"use client";

import { useState } from "react";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { DescriptivePDF } from '@/components/reports/DescriptivePDF';
import { toPng } from 'html-to-image';
import { useRef } from 'react';

import { API_URL } from '@/config/api';

export default function DescriptivePage() {
  const [activeTab, setActiveTab] = useState<'concepts' | 'lab' | 'code'>('concepts');
  const [inputData, setInputData] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputMode, setInputMode] = useState<'manual' | 'file'>('manual');

  const resultsRef = useRef<HTMLDivElement>(null);
  const [reportImage, setReportImage] = useState<string>("");
  const [preparingPdf, setPreparingPdf] = useState(false);

  // Función para capturar el área de resultados antes de generar PDF
  const prepareReport = async () => {
    if (resultsRef.current === null) return;
    setPreparingPdf(true);
    try {
        // Capturamos el div "resultsRef" como PNG
        const dataUrl = await toPng(resultsRef.current, { cacheBust: true, backgroundColor: '#ffffff', fontEmbedCSS: '',});
        setReportImage(dataUrl);
    } catch (err) {
        console.error("Error generando imagen para reporte", err);
    } finally {
        setPreparingPdf(false);
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    const dataArray = inputData.split(",").map(s => Number(s.trim())).filter(n => !isNaN(n));
    
    try {
      const res = await fetch(`${API_URL}/api/v1/descriptive/basic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sample_data: dataArray })
      });
      if (res.ok) setStats(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Código Python básico y didáctico para la pestaña 3
  const pythonCode = `# Cálculo de Estadísticos Descriptivos Básicos
import statistics as stats

datos = [10, 12, 23, 23, 16, 23, 21, 16]

# 3.1 Tendencia Central
media = stats.mean(datos)
mediana = stats.median(datos)
moda = stats.mode(datos)

# 3.2 Dispersión
varianza = stats.variance(datos)
desviacion = stats.stdev(datos)

print(f"Media: {media}")
print(f"Desviación Estándar: {desviacion}")`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">3. Estadística Descriptiva</h1>
        <p className="text-gray-500 mt-2">Análisis numérico de las propiedades del conjunto de datos (3.1 - 3.3).</p>
      </header>

      {/* Navegación Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button onClick={() => setActiveTab('concepts')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'concepts' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>📖 Conceptos</button>
        <button onClick={() => setActiveTab('lab')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'lab' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>🧮 Calculadora</button>
        <button onClick={() => setActiveTab('code')} className={`pb-3 px-6 text-sm font-bold border-b-2 ${activeTab === 'code' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>💻 Código Python</button>
      </div>

      {/* TAB 1: CONCEPTOS */}
      {activeTab === 'concepts' && (
        <div className="grid gap-6 animate-fade-in">
          
          {/* 3.1 Tendencia Central */}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span>🎯</span> 3.1 Medidas de Tendencia Central
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Son valores numéricos que localizan el centro de un conjunto de datos.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Media */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <strong className="block text-blue-800 mb-2">Media (<InlineMath math="\bar{x}" />)</strong>
                <p className="text-xs text-gray-600 mb-2">El promedio aritmético de los datos.</p>
                <div className="text-blue-900 py-2">
                  <BlockMath math="\bar{x} = \frac{\sum x_i}{n}" />
                </div>
              </div>

              {/* Mediana */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <strong className="block text-blue-800 mb-2">Mediana</strong>
                <p className="text-xs text-gray-600 mb-2">El valor central cuando los datos están ordenados.</p>
                <div className="text-blue-900 py-2 text-center text-sm italic">
                   Posición central: <InlineMath math="\frac{n+1}{2}" />
                </div>
              </div>

              {/* Moda */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <strong className="block text-blue-800 mb-2">Moda</strong>
                <p className="text-xs text-gray-600 mb-2">El valor que ocurre con mayor frecuencia.</p>
                <div className="text-blue-900 py-2 text-center">
                   <InlineMath math="Mo = \text{máx}(f_i)" />
                </div>
              </div>
            </div>
          </section>

          {/* 3.2 Variabilidad */}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <span>〰️</span> 3.2 Medidas de Variabilidad
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Indican qué tan dispersos o separados están los datos entre sí.
            </p>

            <div className="space-y-4">
              {/* Varianza y Desviación */}
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <strong className="block text-green-800 mb-1">Varianza Muestral (<InlineMath math="s^2" />)</strong>
                    <p className="text-xs text-gray-500 mb-2">Promedio de las desviaciones al cuadrado.</p>
                    <BlockMath math="s^2 = \frac{\sum (x_i - \bar{x})^2}{n - 1}" />
                 </div>
                 <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <strong className="block text-green-800 mb-1">Desviación Estándar (<InlineMath math="s" />)</strong>
                    <p className="text-xs text-gray-500 mb-2">Raíz cuadrada de la varianza.</p>
                    <BlockMath math="s = \sqrt{s^2}" />
                 </div>
              </div>

              {/* Coeficiente de Variación */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                 <div>
                    <strong className="block text-purple-800">Coeficiente de Variación (CV)</strong>
                    <p className="text-xs text-gray-500 mt-1">Medida porcentual relativa de dispersión.</p>
                 </div>
                 <div className="bg-white px-6 py-2 rounded-lg shadow-sm">
                    <BlockMath math="CV = \frac{s}{|\bar{x}|} \times 100\%" />
                 </div>
              </div>
            </div>
          </section>

          {/* 3.3 Posición */}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <h3 className="text-lg font-bold text-purple-900 mb-2">3.3 Medidas de Posición</h3>
             <ul className="text-sm text-gray-600 space-y-2 pl-4">
               <li className="flex items-center gap-2">
                 <span className="font-bold text-purple-700">Cuartiles (<InlineMath math="Q_k" />):</span> 
                 Dividen los datos en 4 partes iguales. <InlineMath math="Q_1 = 25\%, Q_2 = 50\%, Q_3 = 75\%" />.
               </li>
               <li className="flex items-center gap-2">
                 <span className="font-bold text-purple-700">Deciles (<InlineMath math="D_k" />):</span> 
                 Dividen los datos en 10 partes iguales.
               </li>
               <li className="flex items-center gap-2">
                 <span className="font-bold text-purple-700">Percentiles (<InlineMath math="P_k" />):</span> 
                 Dividen los datos en 100 partes iguales.
               </li>
             </ul>
          </section>
        </div>
      )}

      {/* TAB 2: LABORATORIO */}
      {activeTab === 'lab' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Panel de Entrada */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            
            {/* Selector de Modo (Manual vs Archivo) */}
            <div className="flex justify-center mb-6">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                    <button 
                        onClick={() => setInputMode('manual')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${inputMode === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        ✍️ Entrada Manual
                    </button>
                    <button 
                        onClick={() => setInputMode('file')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${inputMode === 'file' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        📂 Subir Excel / CSV
                    </button>
                </div>
            </div>

            {/* Opción A: Manual */}
            {inputMode === 'manual' && (
                <div className="animate-fade-in">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Escribe tus datos (separados por coma):</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 p-3 border rounded-lg bg-gray-50 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ej: 5.5, 6.2, 5.8, 7.0..."
                            value={inputData}
                            onChange={(e) => setInputData(e.target.value)}
                        />
                        <button 
                            onClick={handleCalculate}
                            className="bg-blue-600 text-white px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                            disabled={loading}
                        >
                            {loading ? "..." : "Calcular"}
                        </button>
                    </div>
                </div>
            )}

            {/* Opción B: Archivo */}
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
                            
                            const formData = new FormData();
                            formData.append("file", file);

                            try {
                                const res = await fetch(`${API_URL}/api/v1/descriptive/upload`, {
                                    method: "POST",
                                    body: formData, // Enviamos el archivo crudo
                                });
                                if (res.ok) {
                                    setStats(await res.json());
                                } else {
                                    alert("Error al procesar el archivo. Asegúrate de que la primera columna tenga números.");
                                }
                            } catch (err) {
                                console.error(err);
                                alert("Error de conexión.");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    />
                    <div className="pointer-events-none">
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-sm font-bold text-gray-700">Arrastra tu archivo aquí o haz clic</p>
                        <p className="text-xs text-gray-400 mt-1">Soporta Excel (.xlsx) y CSV. El sistema leerá la primera columna.</p>
                    </div>
                </div>
            )}
          </div>

          {/* Resultados (Se mantienen igual, ya que 'stats' se llena igual) */}
          {stats && (
            <div className="animate-fade-in">
                
              
              <div className="flex justify-end mb-4 gap-2">
                 {/* Botón 1: Preparar PDF */}
                 {!reportImage ? (
                     <button 
                        onClick={prepareReport}
                        disabled={preparingPdf}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-gray-900 transition-all"
                     >
                        {preparingPdf ? "Preparando..." : "📄 Generar Reporte PDF"}
                     </button>
                 ) : (
                     /* Botón 2: Descargar  */
                     <PDFDownloadLink
                        document={<DescriptivePDF stats={stats} chartImage={reportImage} />}
                        fileName={`Reporte_Descriptivo_${new Date().toISOString().split('T')[0]}.pdf`}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all shadow-md"
                     >
                        {/* @ts-ignore */}
                        {({ loading }) => (loading ? 'Construyendo...' : '⬇️ Descargar PDF')}
                     </PDFDownloadLink>
                 )}
              </div>

              
              {/* ref aquí e id para html-to-image */}
              <div ref={resultsRef} className="grid md:grid-cols-3 gap-6 p-4 bg-white rounded-xl"> 
                  {/* Tarjeta 3.1 */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-blue-500 border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">3.1 Tendencia Central</h4>
                    <div className="space-y-3">
                      <StatRow label="Media" value={stats.summary_stats.mean.toFixed(2)} />
                      <StatRow label="Mediana" value={stats.summary_stats.median.toFixed(2)} />
                      <StatRow label="Moda" value={stats.summary_stats.mode.join(", ")} />
                    </div>
                  </div>

                  {/* Tarjeta 3.2 */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-green-500 border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">3.2 Variabilidad</h4>
                    <div className="space-y-3">
                      <StatRow label="Rango" value={stats.summary_stats.range.toFixed(2)} />
                      <StatRow label="Varianza" value={stats.summary_stats.variance.toFixed(2)} />
                      <StatRow label="Desv. Estándar" value={stats.summary_stats.std_dev.toFixed(4)} />
                      <StatRow label="C. Variación" value={`${stats.summary_stats.coeff_variation.toFixed(2)}%`} highlight />
                    </div>
                  </div>

                  {/* Tarjeta 3.3 */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-purple-500 border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">3.3 Posición</h4>
                    <div className="space-y-3">
                      <StatRow label="Mínimo" value={stats.summary_stats.min} />
                      <StatRow label="Cuartil 1 (25%)" value={stats.summary_stats.q1} />
                      <StatRow label="Cuartil 3 (75%)" value={stats.summary_stats.q3} />
                      <StatRow label="Máximo" value={stats.summary_stats.max} />
                    </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CÓDIGO */}
      {activeTab === 'code' && (
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-3 text-gray-400 font-mono text-sm">calculos_stats.py</span>
              </div>
              <button onClick={handleCopy} className="text-xs font-medium text-gray-300 hover:text-white bg-gray-700 px-3 py-1.5 rounded">
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed text-gray-300"><code>{pythonCode}</code></pre>
            </div>
          </div>
          <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
             <span className="text-2xl">💡</span>
             <div>
               <h4 className="font-bold text-blue-900 text-sm">Nota de Programación</h4>
               <div className="text-blue-800 text-xs mt-1">
                 Python tiene un módulo nativo llamado <code>statistics</code> que simplifica mucho las cosas. Para análisis más avanzados (como los que hace esta app), se suele usar <strong>Pandas</strong> o <strong>NumPy</strong>.
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para filas de datos
function StatRow({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`font-mono font-bold ${highlight ? "text-blue-600 bg-blue-50 px-2 rounded" : "text-gray-800"}`}>
        {value}
      </span>
    </div>
  );
}