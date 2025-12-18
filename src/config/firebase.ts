import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
    getFirestore,
    enableIndexedDbPersistence // 💡 1. IMPORTACIÓN AÑADIDA
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Reemplazar con tu configuración de Firebase
// ... (comentarios eliminados para brevedad)

const firebaseConfig = {
    apiKey: "AIzaSyB6aLgzUCVg20zqBAHoKQGzyJPTH05e_AE",
    authDomain: "iaexpress-2fc66.firebaseapp.com",
    projectId: "iaexpress-2fc66",
    storageBucket: "iaexpress-2fc66.firebasestorage.app",
    messagingSenderId: "879177068386",
    appId: "1:879177068386:web:8164063251f4f33c83063b",
    measurementId: "G-W2V1PQB356"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Providers
export const googleProvider = new GoogleAuthProvider();


// 💡 2. LÓGICA DE PERSISTENCIA AÑADIDA
// Esto ayuda a estabilizar la conexión inicial de Firestore y a prevenir 
// el error "client is offline" al asegurar que la base de datos se inicialice correctamente.

// Definimos la función de forma asíncrona pero la ejecutamos inmediatamente
export const initializeFirestore = async () => {
    try {
        await enableIndexedDbPersistence(db);
        console.log("Firestore persistence enabled successfully!");
    } catch (err: any) {
        if (err.code === 'failed-precondition') {
            console.warn("Firestore: No se pudo habilitar la persistencia. Ya está corriendo en otra pestaña.");
        } else if (err.code === 'unimplemented') {
            console.warn("Firestore: La persistencia no está soportada en este navegador.");
        } else {
            console.error("Error al habilitar la persistencia de Firestore:", err);
        }
    }
};

export default app;