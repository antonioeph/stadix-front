import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos idénticos al módulo anterior para consistencia institucional
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
  data: any;       // Los resultados del backend
  chartImage?: string; // Captura del Scatter Plot
}

export const RegressionPDF = ({ data, chartImage }: ReportProps) => {
  const date = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const r = data.correlation.pearson_r;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* ENCABEZADO DOBLE LOGO */}
        <View style={styles.header}>
            <View style={styles.logoSection}>
                <Image src="/STADIX_logo.png" style={styles.logo} />
                <View style={styles.separator} />
                <Image src="/Logo_de_la_UNACH.svg.png" style={styles.logo} />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Reporte de Inferencia</Text>
                <Text style={styles.subtitle}>Regresión y Correlación</Text>
                <Text style={styles.subtitle}>{date}</Text>
            </View>
        </View>

        {/* 1. MODELO MATEMÁTICO */}
        <Text style={styles.sectionTitle}>1. Modelo de Regresión Lineal</Text>
        <View style={{ marginBottom: 10 }}>
            <View style={styles.row}><Text style={styles.label}>Ecuación de la Recta:</Text><Text style={styles.value}>{data.linear_regression.equation}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Pendiente (m):</Text><Text style={styles.value}>{data.linear_regression.slope.toFixed(4)}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Intersección (b):</Text><Text style={styles.value}>{data.linear_regression.intercept.toFixed(4)}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Coef. Determinación (R²):</Text><Text style={styles.value}>{data.linear_regression.r_squared.toFixed(4)}</Text></View>
            <Text style={{ fontSize: 9, color: '#666', marginTop: 5 }}>
                * El R² indica que el modelo explica el {(data.linear_regression.r_squared * 100).toFixed(2)}% de la variabilidad de los datos.
            </Text>
        </View>

        {/* 2. ANÁLISIS DE CORRELACIÓN */}
        <Text style={styles.sectionTitle}>2. Análisis de Correlación</Text>
        <View style={{ marginBottom: 10 }}>
            <View style={styles.row}><Text style={styles.label}>Pearson (r):</Text><Text style={styles.value}>{data.correlation.pearson_r.toFixed(4)}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Interpretación:</Text><Text style={styles.value}>{data.correlation.interpretation}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Covarianza:</Text><Text style={styles.value}>{data.covariance.toFixed(4)}</Text></View>
        </View>

        {/* 3. GRÁFICA DE DISPERSIÓN */}
        {chartImage && (
            <View wrap={false}>
                <Text style={styles.sectionTitle}>3. Visualización de Ajuste</Text>
                <Image src={chartImage} style={styles.chartImage} />
            </View>
        )}

        {/* 4. CONCLUSIÓN AUTOMÁTICA */}
        <Text style={styles.sectionTitle}>4. Conclusión</Text>
        <View style={{ backgroundColor: '#f0f8ff', padding: 10, borderRadius: 5 }}>
            <Text style={styles.text}>
                El análisis muestra una relación {Math.abs(r) > 0.7 ? "fuerte" : Math.abs(r) > 0.4 ? "moderada" : "débil"} y {r > 0 ? "positiva" : "negativa"} entre las variables. 
                {Math.abs(r) > 0.7 
                    ? " Esto sugiere que la variable X es un buen predictor del comportamiento de Y." 
                    : " Se recomienda precaución al usar este modelo para predicciones debido a la baja correlación."}
            </Text>
        </View>

        <Text style={styles.footer}>Generado por STADIX - Sistema de Aprendizaje Estadístico de Universidad Autónoma de Chiapas (UNACH)</Text>
      </Page>
    </Document>
  );
};