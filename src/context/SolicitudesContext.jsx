import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const SolicitudesContext = createContext(null);

export function SolicitudesProvider({ children }) {
  const [db, setDb] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    let activo = true;

    async function iniciar() {
      try {
        const conexion = await SQLite.openDatabaseAsync('solicitudes.db');
        await conexion.execAsync(`
          CREATE TABLE IF NOT EXISTS solicitudes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asunto TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            sincronizado INTEGER NOT NULL DEFAULT 0,
            revisado INTEGER NOT NULL DEFAULT 0
          );
        `);

        const columnas = await conexion.getAllAsync(
          'PRAGMA table_info(solicitudes)'
        );
        if (!columnas.some((columna) => columna.name === 'revisado')) {
          await conexion.execAsync(
            'ALTER TABLE solicitudes ADD COLUMN revisado INTEGER NOT NULL DEFAULT 0'
          );
        }

        if (!activo) return;

        const filas = await conexion.getAllAsync(
          'SELECT * FROM solicitudes ORDER BY id DESC'
        );
        setDb(conexion);
        setSolicitudes(filas);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo abrir la base de datos.');
      }
    }

    iniciar();
    return () => {
      activo = false;
    };
  }, []);

  const agregarSolicitud = useCallback(async (asunto, descripcion) => {
    if (!db) return false;

    const asuntoLimpio = asunto.trim();
    const descripcionLimpia = descripcion.trim();
    if (!asuntoLimpio || !descripcionLimpia) {
      Alert.alert('Validación', 'Complete asunto y descripción.');
      return false;
    }

    try {
      const resultado = await db.runAsync(
        'INSERT INTO solicitudes (asunto, descripcion, sincronizado, revisado) VALUES (?, ?, 0, 0)',
        [asuntoLimpio, descripcionLimpia]
      );
      setSolicitudes((actuales) => [
        {
          id: resultado.lastInsertRowId,
          asunto: asuntoLimpio,
          descripcion: descripcionLimpia,
          sincronizado: 0,
          revisado: 0,
        },
        ...actuales,
      ]);
      return true;
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar la solicitud.');
      return false;
    }
  }, [db]);

  const eliminarSolicitud = useCallback(async (id) => {
    if (!db) return false;

    try {
      await db.runAsync('DELETE FROM solicitudes WHERE id = ?', [id]);
      setSolicitudes((actuales) => actuales.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo eliminar la solicitud.');
      return false;
    }
  }, [db]);

  const marcarRevisada = useCallback(async (id) => {
    if (!db) return false;

    try {
      await db.runAsync(
        'UPDATE solicitudes SET revisado = 1 WHERE id = ?',
        [id]
      );
      setSolicitudes((actuales) =>
        actuales.map((item) =>
          item.id === id ? { ...item, revisado: 1 } : item
        )
      );
      return true;
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo marcar la solicitud como revisada.');
      return false;
    }
  }, [db]);

  const value = useMemo(
    () => ({
      solicitudes,
      agregarSolicitud,
      eliminarSolicitud,
      marcarRevisada,
      dbDisponible: db !== null,
    }),
    [db, solicitudes, agregarSolicitud, eliminarSolicitud, marcarRevisada]
  );

  return (
    <SolicitudesContext.Provider value={value}>
      {children}
    </SolicitudesContext.Provider>
  );
}

export function useSolicitudes() {
  const contexto = useContext(SolicitudesContext);
  if (!contexto) {
    throw new Error('useSolicitudes debe usarse dentro de SolicitudesProvider');
  }
  return contexto;
}
