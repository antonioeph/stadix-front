import Link from "next/link";

export default function Home() {
  
  // Configuración de los módulos para generar el grid dinámicamente
  const modules = [
    {
      title: "1. Variables y Datos",
      desc: "Aprende a identificar y clasificar los tipos de variables estadísticas.",
      path: "/variables",
      icon: "🔍",
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
      textColor: "text-blue-700"
    },
    {
      title: "2. Organización",
      desc: "Tablas de frecuencia, histogramas, diagramas de caja y circulares.",
      path: "/organizacion",
      icon: "📊",
      color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400",
      textColor: "text-indigo-700"
    },
    {
      title: "3. Est. Descriptiva",
      desc: "Medidas de tendencia central, dispersión y posición con carga de Excel.",
      path: "/descriptive",
      icon: "∑",
      color: "bg-cyan-50 border-cyan-200 hover:border-cyan-400",
      textColor: "text-cyan-700"
    },
    {
      title: "3.5 Probabilidad",
      desc: "Calculadoras visuales para Binomial, Poisson y Distribución Normal.",
      path: "/probabilidad",
      icon: "🎲",
      color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
      textColor: "text-emerald-700"
    },
    {
      title: "4. Inferencia",
      desc: "Regresión Lineal, Correlación y Pruebas de Hipótesis (T-Student, ANOVA).",
      path: "/inferencial",
      icon: "🔮",
      color: "bg-violet-50 border-violet-200 hover:border-violet-400",
      textColor: "text-violet-700"
    },
    {
      title: "5. No Paramétrica",
      desc: "Pruebas libres de distribución como Chi-Cuadrada.",
      path: "/no-parametrica",
      icon: "≠",
      color: "bg-fuchsia-50 border-fuchsia-200 hover:border-fuchsia-400",
      textColor: "text-fuchsia-700"
    },
    {
      title: "6. Muestreo",
      desc: "Calculadora de tamaño de muestra para poblaciones finitas e infinitas.",
      path: "/muestreo",
      icon: "🎯",
      color: "bg-orange-50 border-orange-200 hover:border-orange-400",
      textColor: "text-orange-700"
    },
  ];

  return (
    <div className="animate-fade-in pb-10">
      
      {/* --- HERO SECTION --- */}
      <div className="text-center py-12 px-4">
        <div className="inline-block p-4 rounded-full bg-blue-100 mb-4 shadow-sm">
          <span className="text-5xl">🎓</span>
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Bienvenido a <span className="text-blue-600">STADIX</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          La plataforma interactiva de la <span className="font-semibold text-slate-800">UNACH</span> diseñada para transformar el aprendizaje de la estadística: de la teoría a la práctica profesional.
        </p>
      </div>

      {/* --- CÓMO USAR LA APP (Features) --- */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="grid md:grid-cols-3 gap-6 px-4">
          <FeatureCard 
            icon="📖" 
            title="Conceptos Claros" 
            text="Repasa la teoría fundamental con explicaciones didácticas y fórmulas matemáticas detalladas." 
          />
          <FeatureCard 
            icon="🧪" 
            title="Laboratorio Interactivo" 
            text="Sube tus propios archivos Excel o ingresa datos para ver cálculos y gráficas en tiempo real." 
          />
          <FeatureCard 
            icon="💻" 
            title="Código Python" 
            text="Aprende programación estadística viendo el código real que ejecuta cada análisis." 
          />
        </div>
      </div>

      {/* --- GRID DE MÓDULOS --- */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-2 flex items-center gap-2">
          <span>📂</span> Catálogo de Módulos
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, index) => (
            <Link href={mod.path} key={index} className="group">
              <div className={`h-full p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${mod.color}`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{mod.icon}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/50 text-slate-500">
                    Ir al módulo →
                  </span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${mod.textColor}`}>
                  {mod.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {mod.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* --- FOOTER SIMPLE --- */}
      <div className="text-center mt-20 text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Universidad Autónoma de Chiapas - Proyecto Educativo. Desarrollado por Antonio E.P. Heredia y Jorge J.P. Heredia</p>
      </div>

    </div>
  );
}

// Componente auxiliar para las tarjetas de "Cómo usar"
function FeatureCard({ icon, title, text }: { icon: string, title: string, text: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}