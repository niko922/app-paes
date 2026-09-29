import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  SafeAreaView,
} from "react-native";

const ensayoPAES = {
  id: "PAES_M1_DIAGNOSTICO",
  nombre: "Ensayo Diagnóstico M1 - Matemática",
  preguntas: [
    {
      numero: 1,
      eje: "Números",
      correcta: "B",
      videoUrl:
        "https://www.youtube.com/results?search_query=paes+matematica+numeros+operaciones",
    },
    {
      numero: 2,
      eje: "Álgebra y Funciones",
      correcta: "D",
      videoUrl:
        "https://www.youtube.com/results?search_query=paes+matematica+ecuaciones+primer+grado",
    },
    {
      numero: 3,
      eje: "Geometría",
      correcta: "A",
      videoUrl:
        "https://www.youtube.com/results?search_query=paes+matematica+geometria+triangulos",
    },
    {
      numero: 4,
      eje: "Probabilidad y Estadística",
      correcta: "C",
      videoUrl:
        "https://www.youtube.com/results?search_query=paes+matematica+probabilidad+media+mediana",
    },
  ],
};

export default function Index() {
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);

  const seleccionarOpcion = (numPregunta, opcion) => {
    setRespuestas({ ...respuestas, [numPregunta]: opcion });
  };

  const calcularResultados = () => {
    let buenas = 0;
    let malas = 0;
    const desglose = {};
    const erradas = [];

    ensayoPAES.preguntas.forEach((p) => {
      const respUsuario = respuestas[p.numero];
      const esCorrecta = respUsuario === p.correcta;

      if (!desglose[p.eje]) {
        desglose[p.eje] = { buenas: 0, total: 0 };
      }
      desglose[p.eje].total += 1;

      if (esCorrecta) {
        buenas += 1;
        desglose[p.eje].buenas += 1;
      } else {
        malas += 1;
        erradas.push({
          ...p,
          tuRespuesta: respUsuario || "Sin responder",
        });
      }
    });

    setResultado({ buenas, malas, desglose, erradas });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>{ensayoPAES.nombre}</Text>

        {!resultado ? (
          <View>
            <Text style={styles.instrucciones}>
              Marca tus alternativas sin exponer tus resultados:
            </Text>
            {ensayoPAES.preguntas.map((p) => (
              <View key={p.numero} style={styles.cardPregunta}>
                <Text style={styles.textoPregunta}>
                  Pregunta {p.numero}{" "}
                  <Text style={styles.ejeBadge}>({p.eje})</Text>
                </Text>
                <View style={styles.rowOpciones}>
                  {["A", "B", "C", "D"].map((opcion) => (
                    <TouchableOpacity
                      key={opcion}
                      style={[
                        styles.btnOpcion,
                        respuestas[p.numero] === opcion &&
                          styles.btnOpcionActiva,
                      ]}
                      onPress={() => seleccionarOpcion(p.numero, opcion)}
                    >
                      <Text
                        style={
                          respuestas[p.numero] === opcion
                            ? styles.txtBlanco
                            : styles.txtNegro
                        }
                      >
                        {opcion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.btnCalcular}
              onPress={calcularResultados}
            >
              <Text style={styles.txtBtnCalcular}>Ver Resultados Privados</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.cardResumen}>
              <Text style={styles.tituloResumen}>Resumen de Tu Ensayo</Text>
              <Text style={styles.txtResumen}>
                Correctas: {resultado.buenas}
              </Text>
              <Text style={styles.txtResumen}>
                Incorrectas / Omitidas: {resultado.malas}
              </Text>
            </View>

            <Text style={styles.subtituloSection}>
              Rendimiento por Área Temática:
            </Text>
            {Object.keys(resultado.desglose).map((eje) => {
              const datos = resultado.desglose[eje];
              const porcentaje = Math.round((datos.buenas / datos.total) * 100);
              return (
                <View key={eje} style={styles.cardEje}>
                  <Text style={styles.nombreEje}>{eje}</Text>
                  <Text style={styles.porcentajeEje}>
                    {datos.buenas} de {datos.total} correctas ({porcentaje}%)
                  </Text>
                </View>
              );
            })}

            <Text style={styles.subtituloSection}>
              Ejercicios a Reforzar (Links Explicativos):
            </Text>
            {resultado.erradas.length === 0 ? (
              <Text style={styles.txtExito}>
                ¡Excelente! Tuviste todas las preguntas buenas.
              </Text>
            ) : (
              resultado.erradas.map((err) => (
                <View key={err.numero} style={styles.cardErrada}>
                  <Text style={styles.txtErrada}>
                    Pregunta {err.numero} — Marcaste:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {err.tuRespuesta}
                    </Text>{" "}
                    | Correcta:{" "}
                    <Text style={{ fontWeight: "bold", color: "#2e7d32" }}>
                      {err.correcta}
                    </Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.btnVideo}
                    onPress={() => Linking.openURL(err.videoUrl)}
                  >
                    <Text style={styles.txtBlanco}>
                      ▶ Ver Explicación en YouTube
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            <TouchableOpacity
              style={styles.btnReintentar}
              onPress={() => {
                setResultado(null);
                setRespuestas({});
              }}
            >
              <Text style={styles.txtBtnCalcular}>Ingresar Otro Ensayo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f5f7" },
  container: { flex: 1, padding: 20 },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#1a1a1a",
  },
  instrucciones: { fontSize: 14, color: "#666", marginBottom: 15 },
  cardPregunta: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  textoPregunta: { fontSize: 15, fontWeight: "600", marginBottom: 10 },
  ejeBadge: { fontSize: 12, color: "#007aff", fontWeight: "normal" },
  rowOpciones: { flexDirection: "row", justifyContent: "space-between" },
  btnOpcion: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },
  btnOpcionActiva: { backgroundColor: "#007aff", borderColor: "#007aff" },
  txtBlanco: { color: "#fff", fontWeight: "bold" },
  txtNegro: { color: "#333", fontWeight: "600" },
  btnCalcular: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 40,
  },
  btnReintentar: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  txtBtnCalcular: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cardResumen: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  tituloResumen: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  txtResumen: { fontSize: 14, marginVertical: 2 },
  subtituloSection: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#333",
  },
  cardEje: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  nombreEje: { fontWeight: "bold", color: "#007aff" },
  porcentajeEje: { fontSize: 13, color: "#555", marginTop: 2 },
  cardErrada: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#d9534f",
  },
  txtErrada: { fontSize: 14, marginBottom: 8 },
  btnVideo: {
    backgroundColor: "#cc181e",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  txtExito: { color: "#28a745", fontWeight: "bold", marginVertical: 10 },
});
