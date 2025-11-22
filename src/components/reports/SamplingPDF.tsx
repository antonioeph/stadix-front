import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#112233', paddingBottom: 10, alignItems: 'center', justifyContent: 'space-between' },
  logoSection: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 80, height: 40, objectFit: 'contain' },
  separator: { height: 30, width: 1, backgroundColor: '#ccc', marginHorizontal: 10 },
  titleContainer: { textAlign: 'right' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#112233' },
  subtitle: { fontSize: 10, color: '#666' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 15, marginBottom: 10, color: '#0055aa' },
  text: { fontSize: 10, marginBottom: 5, lineHeight: 1.5 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 5 },
  label: { width: '50%', fontSize: 10, fontWeight: 'bold', color: '#444' },
  value: { width: '50%', fontSize: 10 },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, fontSize: 8, textAlign: 'center', color: '#aaa' },
});

interface ReportProps {
  data: any;
  inputs: any;
}

export const SamplingPDF = ({ data, inputs }: ReportProps) => {
  const date = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.header}>
            <View style={styles.logoSection}>
                <Image src="/STADIX_logo.png" style={styles.logo} />
                <View style={styles.separator} />
                <Image src="/Logo_de_la_UNACH.svg.png" style={styles.logo} />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Cálculo de Muestra</Text>
                <Text style={styles.subtitle}>Planificación de Investigación</Text>
                <Text style={styles.subtitle}>{date}</Text>
            </View>
        </View>

        {/* PARÁMETROS */}
        <Text style={styles.sectionTitle}>1. Parámetros de Diseño</Text>
        <View style={{ marginBottom: 10 }}>
            <View style={styles.row}><Text style={styles.label}>Nivel de Confianza:</Text><Text style={styles.value}>{inputs.confidence}% (Z = {data.z_score.toFixed(2)})</Text></View>
            <View style={styles.row}><Text style={styles.label}>Margen de Error:</Text><Text style={styles.value}>{inputs.error}%</Text></View>
            <View style={styles.row}><Text style={styles.label}>Heterogeneidad (p/q):</Text><Text style={styles.value}>{inputs.p} / {data.q_value}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Tipo de Población:</Text><Text style={styles.value}>{data.formula}</Text></View>
            {data.is_finite && (
                <View style={styles.row}><Text style={styles.label}>Tamaño Población (N):</Text><Text style={styles.value}>{inputs.population}</Text></View>
            )}
        </View>

        {/* RESULTADOS */}
        <Text style={styles.sectionTitle}>2. Tamaño de Muestra Requerido</Text>
        <View style={{ backgroundColor: '#f0f9ff', padding: 20, borderRadius: 5, alignItems: 'center' }}>
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#0284c7' }}>n = {data.sample_size}</Text>
            <Text style={{ fontSize: 10, color: '#555', marginTop: 10 }}>Unidades Muestrales</Text>
        </View>

        {/* CONCLUSIÓN */}
        <Text style={styles.sectionTitle}>3. Interpretación</Text>
        <View style={{ backgroundColor: '#f0f8ff', padding: 10, borderRadius: 5 }}>
            <Text style={styles.text}>
                Para obtener resultados con un {inputs.confidence}% de confianza y un margen de error máximo del {inputs.error}%, 
                se requiere encuestar o analizar a un mínimo de {data.sample_size} elementos seleccionados aleatoriamente 
                {data.is_finite ? ` de la población total de ${inputs.population} individuos.` : " de la población infinita."}
            </Text>
        </View>

        <Text style={styles.footer}>Generado por STADIX - Sistema de Aprendizaje Estadístico de Universidad Autónoma de Chiapas (UNACH)</Text>
      </Page>
    </Document>
  );
};