import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { storage, db, auth } from '../config/firebase';

export type DocumentType = 'cedula_ve' | 'cpf_br' | 'rg_br' | 'passport' | 'license';
export type Country = 'VE' | 'BR';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface IdentityDocument {
    id?: string;
    userId: string;
    documentType: DocumentType;
    documentNumber: string;
    country: Country;
    frontImageUrl: string;
    backImageUrl?: string;
    verificationStatus: VerificationStatus;
    verifiedAt?: Timestamp;
    verifiedBy?: string;
    rejectionReason?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface DocumentUploadData {
    documentType: DocumentType;
    documentNumber: string;
    country: Country;
    frontImage: File;
    backImage?: File;
}

class DocumentService {
    private documentsCollection = 'identity_documents';

    // Upload document for verification
    async uploadDocument(data: DocumentUploadData): Promise<string> {
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        try {
            // Upload front image
            const frontImageUrl = await this.uploadImage(
                data.frontImage,
                user.uid,
                'front'
            );

            // Upload back image if provided
            let backImageUrl: string | undefined;
            if (data.backImage) {
                backImageUrl = await this.uploadImage(
                    data.backImage,
                    user.uid,
                    'back'
                );
            }

            // Create document record
            const documentData: Omit<IdentityDocument, 'id'> = {
                userId: user.uid,
                documentType: data.documentType,
                documentNumber: data.documentNumber,
                country: data.country,
                frontImageUrl,
                backImageUrl,
                verificationStatus: 'pending',
                createdAt: serverTimestamp() as Timestamp,
                updatedAt: serverTimestamp() as Timestamp
            };

            const docRef = await addDoc(collection(db, this.documentsCollection), documentData);

            return docRef.id;
        } catch (error: any) {
            console.error('Error uploading document:', error);
            throw new Error('Error al subir el documento: ' + error.message);
        }
    }

    // Upload image to Firebase Storage
    private async uploadImage(file: File, userId: string, side: 'front' | 'back'): Promise<string> {
        const timestamp = Date.now();
        const fileName = `documents/${userId}/${timestamp}_${side}_${file.name}`;
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    }

    // Get user's documents
    async getUserDocuments(): Promise<IdentityDocument[]> {
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        try {
            const q = query(
                collection(db, this.documentsCollection),
                where('userId', '==', user.uid)
            );

            const querySnapshot = await getDocs(q);
            const documents: IdentityDocument[] = [];

            querySnapshot.forEach((doc) => {
                documents.push({
                    id: doc.id,
                    ...doc.data()
                } as IdentityDocument);
            });

            return documents;
        } catch (error: any) {
            console.error('Error getting documents:', error);
            throw new Error('Error al obtener documentos');
        }
    }

    // Get document by ID
    async getDocument(documentId: string): Promise<IdentityDocument | null> {
        try {
            const docRef = doc(db, this.documentsCollection, documentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                } as IdentityDocument;
            }

            return null;
        } catch (error: any) {
            console.error('Error getting document:', error);
            return null;
        }
    }

    // Check if user has verified document
    async hasVerifiedDocument(): Promise<boolean> {
        const documents = await this.getUserDocuments();
        return documents.some(doc => doc.verificationStatus === 'approved');
    }

    // Get document type label
    getDocumentTypeLabel(type: DocumentType): string {
        const labels: { [key: string]: string } = {
            'cedula_ve': '🇻🇪 Cédula de Identidad',
            'cpf_br': '🇧🇷 CPF',
            'rg_br': '🇧🇷 RG',
            'passport': '🌎 Pasaporte',
            'license': '🚗 Licencia de Conducir'
        };

        return labels[type] || type;
    }

    // Get status label
    getStatusLabel(status: VerificationStatus): { label: string; color: string } {
        const labels = {
            pending: { label: 'Pendiente', color: 'yellow' },
            approved: { label: 'Aprobado', color: 'green' },
            rejected: { label: 'Rechazado', color: 'red' }
        };

        return labels[status];
    }

    // Admin: Approve document
    async approveDocument(documentId: string, adminId: string): Promise<void> {
        try {
            const docRef = doc(db, this.documentsCollection, documentId);
            await updateDoc(docRef, {
                verificationStatus: 'approved',
                verifiedAt: serverTimestamp(),
                verifiedBy: adminId,
                updatedAt: serverTimestamp()
            });
        } catch (error: any) {
            console.error('Error approving document:', error);
            throw new Error('Error al aprobar documento');
        }
    }

    // Admin: Reject document
    async rejectDocument(documentId: string, adminId: string, reason: string): Promise<void> {
        try {
            const docRef = doc(db, this.documentsCollection, documentId);
            await updateDoc(docRef, {
                verificationStatus: 'rejected',
                verifiedAt: serverTimestamp(),
                verifiedBy: adminId,
                rejectionReason: reason,
                updatedAt: serverTimestamp()
            });
        } catch (error: any) {
            console.error('Error rejecting document:', error);
            throw new Error('Error al rechazar documento');
        }
    }

    // Delete document images from storage
    async deleteDocumentImages(document: IdentityDocument): Promise<void> {
        try {
            // Delete front image
            const frontRef = ref(storage, document.frontImageUrl);
            await deleteObject(frontRef);

            // Delete back image if exists
            if (document.backImageUrl) {
                const backRef = ref(storage, document.backImageUrl);
                await deleteObject(backRef);
            }
        } catch (error: any) {
            console.error('Error deleting images:', error);
        }
    }
}

export const documentService = new DocumentService();
