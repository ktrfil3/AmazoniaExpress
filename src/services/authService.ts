// --- 1. Importaciones de FUNCIONES (Valores de Runtime) ---
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendEmailVerification,
    updateProfile,
    // Eliminadas User y UserCredential de aquí
} from 'firebase/auth';

// --- 2. Importaciones de TIPOS (Solo para tipado en TypeScript) ---
import type {
    User, // CORRECCIÓN 1: Separado como tipo
    UserCredential // Separado como tipo
} from 'firebase/auth';

import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

export interface SignupData {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

export interface UserProfile {
    uid: string;
    email: string | null;
    name: string;
    // El tipo debe aceptar null, ya que usamos null en Firestore si no hay valor
    phone?: string | null;
    emailVerified: boolean;
    photoURL?: string | null;
    createdAt: any;
    updatedAt: any;
}

class AuthService {
    // Sign up with email and password
    async signupWithEmail(data: SignupData): Promise<UserCredential> {
        try {
            // Create user
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            // Update profile with name
            await updateProfile(userCredential.user, {
                displayName: data.name
            });

            // Send verification email
            await sendEmailVerification(userCredential.user);

            // Create user profile in Firestore
            await this.createUserProfile(userCredential.user, data);

            return userCredential;
        } catch (error: any) {
            throw this.handleAuthError(error);
        }
    }

    // Login with email and password
    async loginWithEmail(email: string, password: string): Promise<UserCredential> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Update last login
            await this.updateLastLogin(userCredential.user.uid);

            return userCredential;
        } catch (error: any) {
            throw this.handleAuthError(error);
        }
    }

    // Login with Google
    async loginWithGoogle(): Promise<UserCredential> {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);

            // Check if user profile exists, if not create it
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

            if (!userDoc.exists()) {
                await this.createUserProfile(userCredential.user, {
                    email: userCredential.user.email!,
                    password: '', // No password for OAuth
                    name: userCredential.user.displayName || 'Usuario',
                    // El campo 'phone' será manejado como 'undefined' y convertido a 'null'
                });
            } else {
                await this.updateLastLogin(userCredential.user.uid);
            }

            return userCredential;
        } catch (error: any) {
            throw this.handleAuthError(error);
        }
    }

    // Logout
    async logout(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error: any) {
            throw this.handleAuthError(error);
        }
    }

    // Resend verification email
    async resendVerificationEmail(): Promise<void> {
        const user = auth.currentUser;
        if (!user) throw new Error('No hay usuario autenticado');

        try {
            await sendEmailVerification(user);
        } catch (error: any) {
            throw this.handleAuthError(error);
        }
    }

    // Create user profile in Firestore
    private async createUserProfile(user: User, data: SignupData): Promise<void> {
        const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email,
            name: data.name,
            // CORRECCIÓN 2: Si data.phone es undefined (o null), se usa null para Firestore.
            phone: data.phone ?? null,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);
    }

    // Update last login timestamp
    private async updateLastLogin(uid: string): Promise<void> {
        await updateDoc(doc(db, 'users', uid), {
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    }

    // Get user profile from Firestore
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));

            if (userDoc.exists()) {
                return userDoc.data() as UserProfile;
            }

            return null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    }

    // Handle auth errors
    private handleAuthError(error: any): Error {
        const errorMessages: { [key: string]: string } = {
            'auth/email-already-in-use': 'Este email ya está registrado',
            'auth/invalid-email': 'Email inválido',
            'auth/operation-not-allowed': 'Operación no permitida',
            'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
            'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
            'auth/user-not-found': 'Usuario no encontrado',
            'auth/wrong-password': 'Contraseña incorrecta',
            'auth/invalid-credential': 'Credenciales inválidas',
            'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
            'auth/popup-closed-by-user': 'Ventana cerrada por el usuario',
            'auth/cancelled-popup-request': 'Solicitud cancelada',
            'auth/unauthorized-domain': 'Dominio no autorizado. Agrega tu IP en Firebase Console > Authentication > Settings.'
        };

        const message = errorMessages[error.code] || error.message || 'Error de autenticación';
        return new Error(message);
    }
}

export const authService = new AuthService();