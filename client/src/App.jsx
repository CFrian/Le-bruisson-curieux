
// Point d'entrée de l'application React.
// Définit toutes les routes publiques et protégées.
// BrowserRouter gère la navigation côté client (sans rechargement de page).


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


// Pages publiques
import CvPage from './pages/public/CvPage';
import ProjectsPage from './pages/public/ProjectsPage';
import Home from './pages/public/Home';

// Pages admin
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';


function App() {


  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className='flex-1'>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/formation" element={<CvPage />} />
              <Route path="/projets" element={<ProjectsPage />} />

              {/* Routes admin */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin/dashboard" element={<DashboardPage />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      {/* ToastContainer — affiche les notifications react-toastify sur toute l'app */}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default App;
