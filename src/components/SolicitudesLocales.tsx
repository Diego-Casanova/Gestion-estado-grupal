import { StyleSheet, Text, View } from 'react-native';
import ListaSolicitudes from '@/components/ListaSolicitudes';
import RegistroSolicitudes from '@/components/RegistroSolicitudes';

export default function SolicitudesLocales() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Solicitudes locales</Text>
      <RegistroSolicitudes />
      <ListaSolicitudes />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 18,
    backgroundColor: '#f3f7fa',
  },
  titulo: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
