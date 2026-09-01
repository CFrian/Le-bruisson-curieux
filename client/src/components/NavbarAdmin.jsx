// Navigation de l'espace Admin — accès rapide aux pages publiques (vérification visuelle
// après une modification) + icône dynamique login/logout, même logique que Navbar.jsx.

import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'
import bruissonLogo from "/images/bruissonCurieux.png"

export default function NavbarAdmin() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/api/auth/logout');
            logout();
            toast.success('Déconnexion réussie.');
            navigate('/accueil');
        } catch (err) {
            toast.error('Erreur lors de la déconnexion.');
        }
    };

    return (
        <header>
            <nav className='h-20 pr-10 pl-10 flex items-center bg-black text-white text-2xl'>
                <Link to="/accueil" aria-label="Retour à l'accueil du Bruisson Curieux">
                    <img src={bruissonLogo} alt="Vers accueil Bruisson Curieux" className="w-15 h-15" />
                </Link>

                <div className='flex-1 flex justify-center items-center gap-20 text-nowrap'>
                    <div className='flex gap-10'>
                        <Link className='opacity-50 hover:opacity-100' to="/projets">Projets</Link>
                        <Link className='opacity-50 hover:opacity-100' to="/formation">Formation</Link>
                        <Link className='opacity-50 hover:opacity-100' to="/articles">Articles</Link>
                        {isAuthenticated && (
                            <Link className='opacity-50 hover:opacity-100' to="/admin/dashboard">Dashboard</Link>
                        )}
                    </div>
                </div>

                {isAuthenticated ? (
                    <button
                        type="button"
                        onClick={handleLogout}
                        aria-label="Se déconnecter"
                        className="w-12 h-12 p-1 cursor-pointer opacity-50 hover:opacity-100"
                    >
                        <svg
                            width="60" height="60" viewBox="0 0 60 60" fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            className="w-full h-full"
                        >
                            <path d="M35 15H45C46.1046 15 47 15.8954 47 17V43C47 44.1046 46.1046 45 45 45H35"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13 30H35M13 30L21 22M13 30L21 38"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                ) : (
                    <Link to="/admin/login" aria-label="Accéder à la connexion admin">
                        <svg
                            width="60" height="60" viewBox="0 0 60 60" fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            className="w-12 h-12 p-1 cursor-pointer opacity-50 hover:opacity-100"
                        >
                            <path d="M49.3176 51.1175C48.1801 47.9275 45.6676 45.11 42.1751 43.1C38.6826 41.09 34.4026 40 30.0001 40C25.5976 40 21.3176 41.09 17.8251 43.1C14.3326 45.11 11.8201 47.9275 10.6826 51.1175"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M30 30C35.5228 30 40 25.5228 40 20C40 14.4772 35.5228 10 30 10C24.4772 10 20 14.4772 20 20C20 25.5228 24.4772 30 30 30Z"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </Link>
                )}
            </nav>
        </header>
    )
}