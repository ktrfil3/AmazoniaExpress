// context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../src/config/firebase'; // Asegúrate que esta ruta es correcta
import { useAuthStore } from '../src/store/useAuthStore';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean; // Indica si estamos esperando la respuesta inicial de Firebase
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Inicialmente cargando

    useEffect(() => {
        // 💡 SUSCRIPCIÓN CLAVE: Esto escucha los cambios de estado del usuario
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);

            // Sincronizar con el store global de Zustand
            if (user) {
                useAuthStore.getState().login({
                    id: user.uid,
                    email: user.email || undefined,
                    name: user.displayName || undefined,
                    phone: user.phoneNumber || undefined,
                    isAuthenticated: true
                });
            } else {
                useAuthStore.getState().logout();
            }

            setLoading(false); // Una vez que tenemos la respuesta, dejamos de cargar
        });

        // Limpia la suscripción al desmontar el componente
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};