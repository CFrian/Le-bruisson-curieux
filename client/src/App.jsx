
// Point d'entrée de l'application React.
// Définit toutes les routes publiques et protégées.
// BrowserRouter gère la navigation côté client (sans rechargement de page).


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

import BlogLayout from './layouts/BlogLayout';
import AdminLayout from './layouts/AdminLayout';
import PortfolioLayout from './layouts/PortfolioLayout';


// Pages publiques
import CvPage from './pages/public/CvPage';
import ProjectsPage from './pages/public/ProjectsPage';
import PrestationsPage from './pages/public/PrestationsPage';

// Pages admin
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import LoginPage from './pages/admin/LoginPage';
import ChangePasswordPage from './pages/admin/ChangePasswordPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminArticlesPage from './pages/admin/AdminArticlesPage';
import AccountSettingsPage from './pages/admin/AccountSettingsPage'
import ForgotPasswordPage from './pages/admin/ForgotPasswordPage'
import ResetPasswordPage from './pages/admin/ResetPasswordPage'
import ArticleFormPage from './pages/admin/ArticleFormPage';
import ProjectFormPage from './pages/admin/ProjectFormPage';
import AdminCvPage from './pages/admin/AdminCvPage';
import AdminTagsPage from './pages/admin/AdminTagsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';

import ArticlesPage from './pages/public/ArticlesPage';
import ArticleSinglePage from './pages/public/ArticleSinglePage';
import AproposPage from './pages/public/AproposPage';
import AccueilPage from './pages/public/AccueilPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/accueil" replace />} />

          <Route element={<PortfolioLayout />}>
            <Route path="/prestations" element={<PrestationsPage />} />
            <Route path="/formation" element={<CvPage />} />
            <Route path="/projets" element={<ProjectsPage />} />
          </Route>

          <Route element={<BlogLayout />}>
            <Route path="/accueil" element={<AccueilPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleSinglePage />} />
            <Route path="/apropos" element={<AproposPage />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin/login" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
            <Route path="/admin/change-password" element={<ChangePasswordPage />} />
            <Route path="/admin/forgot-password" element={<RedirectIfAuthenticated><ForgotPasswordPage /></RedirectIfAuthenticated>} />
            <Route path="/admin/reset-password" element={<RedirectIfAuthenticated><ResetPasswordPage /></RedirectIfAuthenticated>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin/projets" element={<ProtectedRoute><AdminProjectsPage /></ProtectedRoute>} />
            <Route path="/admin/projets/nouveau" element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} />
            <Route path="/admin/projets/:id/modifier" element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} />
            <Route path="/admin/cv" element={<ProtectedRoute><AdminCvPage /></ProtectedRoute>} />
            <Route path="/admin/articles" element={<ProtectedRoute><AdminArticlesPage /></ProtectedRoute>} />
            <Route path="/admin/articles/nouveau" element={<ProtectedRoute><ArticleFormPage /></ProtectedRoute>} />
            <Route path="/admin/articles/:id/modifier" element={<ProtectedRoute><ArticleFormPage /></ProtectedRoute>} />
            <Route path="/admin/tags" element={<ProtectedRoute><AdminTagsPage /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute><AdminCategoriesPage /></ProtectedRoute>} />
            <Route path="/admin/compte" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
          </Route>

        </Routes>

      </BrowserRouter >

      {/* ToastContainer — affiche les notifications react-toastify sur toute l'app */}
      < ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider >
  );
};

export default App;
