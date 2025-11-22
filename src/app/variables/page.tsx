"use client";

import { useState } from "react";
import VariableAnalyzer from "@/components/VariableAnalyzer";

export default function VariablesPage() {
  const [activeTab, setActiveTab] = useState<'concepts' | 'lab' | 'code'>('concepts');
  const [copied, setCopied] = useState(false);

  // El código didáctico que mostraremos
    const pythonCode = `# Ejemplo básico: Determinar el tipo de dato de una sola variable

    dato = 10.5  # Prueba cambiando esto por "Hola" o 5

    # 1. Verificamos el tipo de dato nativo de Python
    tipo = type(dato)

    if tipo == str:
        print("Es Cualitativa (Texto)")

    elif tipo == int:
        print("Es Cuantitativa Discreta (Número Entero)")

    elif tipo == float:
        print("Es Cuantitativa Continua (Número Decimal)")
    `;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">1. Variables, Datos e Información</h1>
        <p className="text-gray-500 mt-2">Fundamentos de la estadística y clasificación de datos.</p>
      </header>

      {/* Navegación de Pestañas */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('concepts')}
          className={`pb-3 px-6 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'concepts' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          📖 Conceptos Teóricos
        </button>
        <button
          onClick={() => setActiveTab('lab')}
          className={`pb-3 px-6 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'lab' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          🧪 Laboratorio Interactivo
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`pb-3 px-6 text-sm font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'code' ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <span>💻</span> Código Python
        </button>
      </div>

      {/* --- PESTAÑA 1: CONCEPTOS --- */}
      {activeTab === 'concepts' && (
        <div className="space-y-8 animate-fade-in">
          {/* Definición */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">¿Qué es la Estadística?</h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              Según Anderson, Sweeney y Williams (2008), se define como "el arte y la ciencia de reunir datos, analizarlos, presentarlos e interpretarlos". Interviene en cada paso del método científico.
            </p>
          </section>

          {/* Variables y Unidades */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-md font-bold text-blue-800 mb-2">Unidades Muestrales</h3>
              <p className="text-sm text-gray-600 mb-4">Objetos de interés de un estudio.</p>
              <ul className="text-xs text-gray-500 space-y-2 bg-gray-50 p-3 rounded-lg">
                <li>• Alumno inscrito (Censo universitario)</li>
                <li>• Personal administrativo</li>
                <li>• Docente universitario</li>
              </ul>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-md font-bold text-blue-800 mb-2">Población</h3>
              <p className="text-sm text-gray-600 mb-4">Grupo particular de unidades muestrales (finitas o infinitas).</p>
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <strong>Ejemplo:</strong> Estaciones en la Zona Metropolitana de Guadalajara para medir PM10.
              </div>
            </section>
          </div>

          {/* Clasificación Detallada */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Clasificación de Variables y Escalas</h2>
            <div className="space-y-6">
              {/* Cualitativas */}
              <div className="border-l-4 border-purple-400 pl-4">
                <h3 className="text-purple-700 font-bold">1. Cualitativas (Categóricas)</h3>
                <p className="text-sm text-gray-600 mt-1">Utilizan etiquetas o nombres para identificar atributos. No tienen sentido aritmético.</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <strong className="block text-xs text-purple-800 uppercase mb-1">Nominal</strong>
                    <p className="text-xs text-gray-600">Sin jerarquía. <br/>Ej: Nacionalidad, Tipo de Sangre.</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <strong className="block text-xs text-purple-800 uppercase mb-1">Ordinal</strong>
                    <p className="text-xs text-gray-600">Con jerarquía. <br/>Ej: Nivel socioeconómico, Nivel de dolor.</p>
                  </div>
                </div>
              </div>

              {/* Cuantitativas */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-green-700 font-bold">2. Cuantitativas (Numéricas)</h3>
                <p className="text-sm text-gray-600 mt-1">Valores numéricos donde las operaciones aritméticas son aplicables.</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <strong className="block text-xs text-green-800 uppercase mb-1">Discretas</strong>
                    <p className="text-xs text-gray-600">Valores finitos/enteros. <br/>Ej: Número de hijos.</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <strong className="block text-xs text-green-800 uppercase mb-1">Continuas</strong>
                    <p className="text-xs text-gray-600">Infinitos valores en intervalo. <br/>Ej: Temperatura, Lluvia.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* --- PESTAÑA 2: LABORATORIO --- */}
      {activeTab === 'lab' && (
        <section className="animate-fade-in">
           <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8">
             <h2 className="text-blue-900 font-bold flex items-center gap-2">
               <span className="text-xl">🧪</span> Práctica de Clasificación
             </h2>
             <p className="text-blue-800 text-sm mt-2">
               Utiliza este espacio!!!!! para ingresar datos brutos. El sistema determinará automáticamente si tu variable es cualitativa o cuantitativa.
             </p>
           </div>
           
           <div className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
              <VariableAnalyzer />
           </div>
        </section>
      )}

      {/* --- PESTAÑA 3: CÓDIGO (NUEVA) --- */}
      {activeTab === 'code' && (
        <section className="animate-fade-in max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {/* Barra superior estilo editor */}
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-3 text-gray-400 font-mono text-sm">analisis_variable.py</span>
              </div>
              <button 
                onClick={handleCopy}
                className="text-xs font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Copiado
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copiar
                  </>
                )}
              </button>
            </div>
            
            {/* Área de código */}
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed text-gray-300">
                <code>
                  {pythonCode}
                </code>
              </pre>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-bold text-blue-900 text-sm">Explicación paso a paso</h4>
              
              <div className="text-blue-800 text-xs mt-1">
                En programación, los datos ya tienen una clasificación interna similar a la estadística:
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li><strong>str (String):</strong> Son cadenas de texto, equivalentes a variables <strong>Cualitativas</strong>.</li>
                  <li><strong>int (Integer):</strong> Son números enteros, equivalentes a <strong>Discretas</strong>.</li>
                  <li><strong>float (Flotante):</strong> Son números con punto decimal, equivalentes a <strong>Continuas</strong>.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}