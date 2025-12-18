// main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
// 💡 Importamos la función que nos da la promesa de inicialización de Firestore
import { initializeFirestore } from './config/firebase';
import { AuthProvider } from '../context/AuthContext';

// --- 1. CONFIGURACIÓN DEL MONTAJE ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('El elemento raíz (#root) no se encontró en el documento.');
}

// Creamos la raíz de React
const root = createRoot(rootElement);

// --- 2. FUNCIÓN DE ARRANQUE ASÍNCRONO ---
async function bootstrap() {
  // Muestra un mensaje de carga inicial (para que no esté en blanco)
  root.render(
    <StrictMode>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Iniciando servicios de la aplicación...
      </div>
    </StrictMode>
  );

  try {
    await initializeFirestore();
    console.log("Servicios de Firebase listos. Montando la aplicación principal.");

    root.render(
      <StrictMode>
        {/* 💡 ENVOLVEMOS LA APLICACIÓN COMPLETA */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>
    );

  } catch (error) {
    console.error("3. ERROR FATAL EN EL ARRANQUE DE LA APLICACIÓN:", error);

    // Muestra un mensaje de error legible al usuario
    root.render(
      <StrictMode>
        <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          <h1>Error al cargar la aplicación.</h1>
          <p>Verifica la conexión a Firebase o la consola (F12).</p>
        </div>
      </StrictMode>
    );
  }
}

// Ejecutar la función de arranque
bootstrap();