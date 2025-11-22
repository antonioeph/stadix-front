import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos del PDF 
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  
  // Encabezado general
  header: { 
    flexDirection: 'row', 
    marginBottom: 20, 
    borderBottomWidth: 2, 
    borderBottomColor: '#112233', 
    paddingBottom: 10, 
    alignItems: 'center',
    justifyContent: 'space-between' // Asegura que logos y título queden en extremos opuestos
  },
  
  // Contenedor para agrupar los dos logos
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // tamaño para que se vean bien en pareja
  logo: { width: 80, height: 40, objectFit: 'contain' },
  
  // Una línea vertical gris entre los logos
  separator: {
    height: 30,
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },

  titleContainer: { textAlign: 'right' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#112233' },
  subtitle: { fontSize: 10, color: '#666' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 15, marginBottom: 10, color: '#0055aa' },
  text: { fontSize: 10, marginBottom: 5, lineHeight: 1.5 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 5 },
  label: { width: '40%', fontSize: 10, fontWeight: 'bold', color: '#444' },
  value: { width: '60%', fontSize: 10 },
  chartImage: { width: '100%', height: 250, marginTop: 10, objectFit: 'contain' },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, fontSize: 8, textAlign: 'center', color: '#aaa' },
});

// Props que recibirá el reporte
interface ReportProps {
  stats: any;       // Los datos calculados
  chartImage?: string; 
}

export const DescriptivePDF = ({ stats, chartImage }: ReportProps) => {
  const s = stats.summary_stats;
  const date = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* ENCABEZADO */}
        {/* ENCABEZADO CON DOBLE LOGO */}
        <View style={styles.header}>
            
            {/* Sección Izquierda: Logos */}
            <View style={styles.logoSection}>
                {/* Logo App */}
                <Image src="/STADIX_logo.png" style={styles.logo} />
                
                {/* Línea divisoria */}
                <View style={styles.separator} />
                
                {/* Logo UNACH */}
                <Image src="/Logo_de_la_UNACH.svg.png" style={styles.logo} />
            </View>

            {/* Sección Derecha: Títulos */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Reporte Estadístico</Text>
                <Text style={styles.subtitle}>Módulo Descriptivo</Text>
                <Text style={styles.subtitle}>{date}</Text>
            </View>
        </View>

        {/* 1. RESUMEN ESTADÍSTICO */}
        <Text style={styles.sectionTitle}>1. Resumen de Datos</Text>
        <View style={{ marginBottom: 10 }}>
            <View style={styles.row}><Text style={styles.label}>Tamaño de Muestra (n):</Text><Text style={styles.value}>{s.n}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Media (Promedio):</Text><Text style={styles.value}>{s.mean.toFixed(4)}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Mediana:</Text><Text style={styles.value}>{s.median.toFixed(4)}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Moda:</Text><Text style={styles.value}>{s.mode.join(", ")}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Desviación Estándar:</Text><Text style={styles.value}>{s.std_dev.toFixed(4)}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Coeficiente de Variación:</Text><Text style={styles.value}>{s.coeff_variation.toFixed(2)}%</Text></View>
            <View style={styles.row}><Text style={styles.label}>Rango:</Text><Text style={styles.value}>[{s.min} - {s.max}] (Amplitud: {s.range.toFixed(2)})</Text></View>
        </View>

        {/* 2. GRÁFICAS (CAPTURA) */}
        {chartImage && (
            <View wrap={false}>
                <Text style={styles.sectionTitle}>2. Análisis Gráfico</Text>
                <Image src={chartImage} style={styles.chartImage} />
                <Text style={{ fontSize: 9, color: '#666', marginTop: 5, textAlign: 'center' }}>
                    Visualización generada automáticamente por STADIX.
                </Text>
            </View>
        )}

        {/* 3. INTERPRETACIÓN AUTOMÁTICA */}
        <Text style={styles.sectionTitle}>3. Interpretación Automática</Text>
        <View style={{ backgroundColor: '#f0f8ff', padding: 10, borderRadius: 5 }}>
            <Text style={styles.text}>
                Los datos presentan una media de {s.mean.toFixed(2)}. 
                La dispersión de los datos es {s.coeff_variation > 20 ? "considerable" : "baja"} ({s.coeff_variation.toFixed(2)}%), 
                lo que indica que el promedio {s.coeff_variation > 20 ? "podría no ser" : "es"} altamente representativo del grupo.
            </Text>
        </View>

        {/* FOOTER */}
        <Text style={styles.footer}>
            Generado por STADIX - Sistema de Aprendizaje Estadístico de la Universidad Autónoma de Chiapas (UNACH)
        </Text>
      </Page>
    </Document>
  );
};