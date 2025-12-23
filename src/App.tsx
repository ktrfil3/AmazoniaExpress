import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { ClientView } from './pages/ClientView';
import { AdminView } from './pages/AdminView';
import { AuthPage } from './pages/AuthPage';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { ProfilePage } from './pages/ProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { BlogPage } from './pages/BlogPage';
import { ArticlePage } from './pages/ArticlePage';

// Importaciones esenciales para el estado global y de autenticación
import { useProductStore } from './store/useProductStore';
import { useAuthStore } from './store/useAuthStore';
import { useAdminAuthStore } from './store/useAdminAuthStore';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { useAuth } from '../context/AuthContext'; // 💡 EL CONTEXTO CON EL ESTADO DE CARGA DE FIREBASE

// ------------------------------------------------------------------
// 1. Componente que protege las rutas. Se mantiene igual.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  // Nota: Asumimos que useAuthStore está sincronizado con el estado de Firebase Auth.
  // La lógica de ESPERA se mueve al componente App.
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentAdmin } = useAdminAuthStore();
  if (!currentAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// ------------------------------------------------------------------
function App() {
  // 💡 PASO CLAVE: Usamos el estado de carga del AuthContext de Firebase
  const { loading } = useAuth();
  const { fetchProducts } = useProductStore();

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 1. Manejo del Estado de Carga (Evita la página en blanco o la redirección prematura)
  if (loading) {
    // Muestra un indicador de carga mientras onAuthStateChanged verifica la sesión
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontSize: '1.2em' }}>
        Verificando sesión...
      </div>
    );
  }

  // 2. Renderizado Principal de Rutas (Solo si loading es FALSE)
  return (
    <Router>
      <Routes>
        {/* Ruta pública de login */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Rutas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navbar />
            <ClientView />
          </ProtectedRoute>
        } />

        <Route path="/product/:id" element={
          <ProtectedRoute>
            <Navbar />
            <ProductDetail />
          </ProtectedRoute>
        } />

        <Route path="/cart" element={
          <ProtectedRoute>
            <Navbar />
            <CartPage />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Navbar />
            <ProfilePage />
          </ProtectedRoute>
        } />

        <Route path="/favorites" element={
          <ProtectedRoute>
            <Navbar />
            <FavoritesPage />
          </ProtectedRoute>
        } />

        <Route path="/blog" element={
          <ProtectedRoute>
            <Navbar />
            <BlogPage />
          </ProtectedRoute>
        } />

        <Route path="/blog/:id" element={
          <ProtectedRoute>
            <Navbar />
            <ArticlePage />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <Navbar />
            <AdminView />
          </ProtectedAdminRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;