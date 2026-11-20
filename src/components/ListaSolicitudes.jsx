import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSolicitudes } from '@/context/SolicitudesContext';

export default function ListaSolicitudes() {
  const { solicitudes, eliminarSolicitud, marcarRevisada } = useSolicitudes();

  function confirmarEliminacion(id) {
    Alert.alert('Eliminar solicitud', '¿Desea eliminar este registro local?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => eliminarSolicitud(id),
      },
    ]);
  }

  const pendientes = solicitudes.filter(
    (solicitud) => solicitud.sincronizado === 0
  ).length;
  const revisadas = solicitudes.filter(
    (solicitud) => solicitud.revisado === 1
  ).length;

  return (
    <View>
      <Text style={styles.resumen}>
        Total: {solicitudes.length} | Pendientes: {pendientes} | Revisadas: {revisadas}
      </Text>

      {solicitudes.length === 0 ? (
        <Text>No existen solicitudes guardadas.</Text>
      ) : (
        solicitudes.map((item) => (
          <View key={item.id} style={styles.tarjeta}>
            <Text style={styles.negrita}>{item.asunto}</Text>
            <Text>{item.descripcion}</Text>
            <Text>
              Estado: {item.sincronizado === 0 ? 'Pendiente' : 'Sincronizado'}
            </Text>
            <Text style={item.revisado === 1 ? styles.revisada : styles.noRevisada}>
              Revisado: {item.revisado === 1 ? 'Sí' : 'No'}
            </Text>
            <View style={styles.fila}>
              <Pressable
                style={[
                  styles.botonAccion,
                  item.revisado === 1 && styles.botonRevisado,
                ]}
                onPress={() => marcarRevisada(item.id)}
                disabled={item.revisado === 1}
              >
                <Text style={styles.accionTexto}>
                  {item.revisado === 1 ? 'Revisada' : 'Revisar'}
                </Text>
              </Pressable>
              <Pressable
                style={styles.botonAccion}
                onPress={() => confirmarEliminacion(item.id)}
              >
                <Text style={styles.accionTexto}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  resumen: {
    marginVertical: 10,
    fontWeight: '600',
  },
  tarjeta: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  negrita: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  fila: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  botonAccion: {
    alignSelf: 'flex-start',
  },
  botonRevisado: {
    opacity: 0.55,
  },
  accionTexto: {
    color: '#087e85',
    fontWeight: 'bold',
  },
  revisada: {
    color: '#087e85',
    fontWeight: 'bold',
  },
  noRevisada: {
    color: '#a05a00',
  },
});
