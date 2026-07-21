
// Point d'entrée de l'application React.
// Définit toutes les routes publiques et protégées.
// BrowserRouter gère la navigation côté client (sans rechargement de page).


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';


// Pages publiques
import CvPage from './pages/public/CvPage';
import ProjectsPage from './pages/public/ProjectsPage';
import PrestationsPage from './pages/public/PrestationsPage';

// Pages admin
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';


function App() {


  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<PrestationsPage />} />
          <Route path="/prestations" element={<PrestationsPage />} />
          <Route path="/cv" element={<CvPage />} />
          <Route path="/projects" element={<ProjectsPage />} />

          {/* Routes admin */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />

        </Routes>
      </BrowserRouter>
      {/* ToastContainer — affiche les notifications react-toastify sur toute l'app */}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default App;
