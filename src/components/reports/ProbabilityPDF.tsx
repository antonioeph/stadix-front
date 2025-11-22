import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos institucionales
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { 
    flexDirection: 'row', 
    marginBottom: 20, 
    borderBottomWidth: 2, 
    borderBottomColor: '#112233', 
    paddingBottom: 10, 
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoSection: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 80, height: 40, objectFit: 'contain' },
  separator: { height: 30, width: 1, backgroundColor: '#ccc', marginHorizontal: 10 },
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

interface ReportProps {
  data: any;        // Resultados del cálculo
  inputs: any;      // Los valores que ingresó el usuario (n, p, k...)
  distType: string; // 'binomial', 'poisson', 'normal'
  chartImage?: string;
}

export const ProbabilityPDF = ({ data, inputs, distType, chartImage }: ReportProps) => {
  const date = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const typeName = distType.charAt(0).toUpperCase() + distType.slice(1); // Capitalizar

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* ENCABEZADO CON DOBLE LOGO */}
        <View style={styles.header}>
            <View style={styles.logoSection}>
                <Image src="/STADIX_logo.png" style={styles.logo} />
                <View style={styles.separator} />
                <Image src="/Logo_de_la_UNACH.svg.png" style={styles.logo} />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Análisis de Probabilidad</Text>
                <Text style={styles.subtitle}>Distribución {typeName}</Text>
                <Text style={styles.subtitle}>{date}</Text>
            </View>
        </View>

        {/* 1. PARÁMETROS DE ENTRADA */}
        <Text style={styles.sectionTitle}>1. Parámetros del Modelo</Text>
        <View style={{ marginBottom: 10 }}>
            {distType === 'binomial' && (
                <>
                    <View style={styles.row}><Text style={styles.label}>Ensayos (n):</Text><Text style={styles.value}>{inputs.n}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Probabilidad Éxito (p):</Text><Text style={styles.value}>{inputs.p}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Éxitos buscados (k):</Text><Text style={styles.value}>{inputs.k}</Text></View>
                </>
            )}
            {distType === 'poisson' && (
                <>
                    <View style={styles.row}><Text style={styles.label}>Tasa Media (Lambda):</Text><Text style={styles.value}>{inputs.lam}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Ocurrencias (k):</Text><Text style={styles.value}>{inputs.k}</Text></View>
                </>
            )}
            {distType === 'normal' && (
                <>
                    <View style={styles.row}><Text style={styles.label}>Media (Mu):</Text><Text style={styles.value}>{inputs.mean}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Desviación Estándar (Sigma):</Text><Text style={styles.value}>{inputs.std}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Valor a evaluar (X):</Text><Text style={styles.value}>{inputs.xVal}</Text></View>
                </>
            )}
        </View>

        {/* 2. RESULTADOS CALCULADOS */}
        <Text style={styles.sectionTitle}>2. Resultados Matemáticos</Text>
        <View style={{ marginBottom: 10 }}>
            {distType === 'normal' ? (
                <>
                    <View style={styles.row}><Text style={styles.label}>Probabilidad (Área izq.):</Text><Text style={styles.value}>{(data.prob_left * 100).toFixed(4)}%</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Puntaje Z (Estandarizado):</Text><Text style={styles.value}>{data.z_score.toFixed(4)}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Probabilidad (Área der.):</Text><Text style={styles.value}>{(data.prob_right * 100).toFixed(4)}%</Text></View>
                </>
            ) : (
                <>
                    <View style={styles.row}><Text style={styles.label}>Probabilidad Exacta P(X=k):</Text><Text style={styles.value}>{(data.prob_exact * 100).toFixed(4)}%</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Probabilidad Acumulada P(X{'<='}k):</Text><Text style={styles.value}>{(data.prob_accumulated * 100).toFixed(4)}%</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Valor Esperado (Media):</Text><Text style={styles.value}>{data.expected_value.toFixed(2)}</Text></View>
                </>
            )}
        </View>

        {/* 3. GRÁFICA (CAPTURA) */}
        {chartImage && (
            <View wrap={false}>
                <Text style={styles.sectionTitle}>3. Visualización de la Distribución</Text>
                <Image src={chartImage} style={styles.chartImage} />
                <Text style={{ fontSize: 9, color: '#666', marginTop: 5, textAlign: 'center' }}>
                    {distType === 'normal' 
                        ? `Gráfico de densidad de probabilidad normal.`
                        : `Gráfico de barras de distribución discreta.`
                    }
                </Text>
            </View>
        )}

        {/* 4. INTERPRETACIÓN */}
        <Text style={styles.sectionTitle}>4. Interpretación</Text>
        <View style={{ backgroundColor: '#f0f8ff', padding: 10, borderRadius: 5 }}>
            <Text style={styles.text}>
                {distType === 'normal'
                    ? `Dado una media de ${inputs.mean} y desviación de ${inputs.std}, existe una probabilidad del ${(data.prob_left * 100).toFixed(2)}% de encontrar un valor menor o igual a ${inputs.xVal}.`
                    : `Bajo los parámetros establecidos, la probabilidad de que ocurra el evento exactamente ${inputs.k} veces es del ${(data.prob_exact * 100).toFixed(2)}%.`
                }
            </Text>
        </View>

        <Text style={styles.footer}>Generado por STADIX - Sistema de Aprendizaje Estadístico de Universidad Autónoma de Chiapas (UNACH)</Text>
      </Page>
    </Document>
  );
};