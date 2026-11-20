import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSolicitudes } from '@/context/SolicitudesContext';

export default function RegistroSolicitudes() {
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const { agregarSolicitud, dbDisponible } = useSolicitudes();

  async function registrar() {
    const guardado = await agregarSolicitud(asunto, descripcion);
    if (guardado) {
      setAsunto('');
      setDescripcion('');
    }
  }

  return (
    <View>
      <TextInput
        style={styles.campo}
        placeholder="Asunto"
        value={asunto}
        onChangeText={setAsunto}
      />
      <TextInput
        style={styles.campo}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />
      <Pressable
        style={[styles.boton, !dbDisponible && styles.botonDeshabilitado]}
        onPress={registrar}
        disabled={!dbDisponible}
      >
        <Text style={styles.botonTexto}>Guardar solicitud</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    borderWidth: 1,
    borderColor: '#b8c8d0',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
  boton: {
    backgroundColor: '#087e85',
    padding: 13,
    borderRadius: 8,
    marginVertical: 12,
    alignItems: 'center',
  },
  botonDeshabilitado: {
    opacity: 0.55,
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
});
