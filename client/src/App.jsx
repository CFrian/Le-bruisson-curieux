
// Point d'entrée de l'application React.
// Définit toutes les routes publiques et protégées.
// BrowserRouter gère la navigation côté client (sans rechargement de page).


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

import PortfolioLayout from './layouts/PortfolioLayout'; // adapte le chemin exact
import ProjectFormPage from './pages/admin/ProjectFormPage';// adapte le chemin exact selon ton arborescence

// Pages publiques
import CvPage from './pages/public/CvPage';
import ProjectsPage from './pages/public/ProjectsPage';
import PrestationsPage from './pages/public/PrestationsPage';

// Pages admin
import LoginPage from './pages/admin/LoginPage';
import ChangePasswordPage from './pages/admin/ChangePasswordPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import AdminCvPage from './pages/admin/AdminCvPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Toutes les routes ci-dessous partagent Navbar/Footer via PortfolioLayout */}
          <Route element={<PortfolioLayout />}>

            {/* Routes publiques */}
            <Route path="/prestations" element={<PrestationsPage />} />
            <Route path="/formation" element={<CvPage />} />
            <Route path="/projets" element={<ProjectsPage />} />

            {/* Routes admin */}
            <Route path="/admin/login" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
            <Route path="/admin/change-password" element={<ChangePasswordPage />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin/projets" element={<ProtectedRoute><AdminProjectsPage /></ProtectedRoute>} />
            <Route path="/admin/projets/nouveau" element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} />
            <Route path="/admin/projets/:id/modifier" element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} />
            <Route path="/admin/cv" element={<ProtectedRoute><AdminCvPage /></ProtectedRoute>} />

          </Route>
        </Routes>

      </BrowserRouter >

      {/* ToastContainer — affiche les notifications react-toastify sur toute l'app */}
      < ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider >
  );
};

export default App;
