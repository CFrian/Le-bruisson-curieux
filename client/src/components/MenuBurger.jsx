import { useState } from "react";
import { Link } from "react-router-dom";

export default function MenuBurger({ links, isAuthenticated, onLogout, loginPath = "/admin/login" }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Icône burger visible uniquement en dessous de md */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Ouvrir le menu"
                className="md:hidden w-10 h-8 flex flex-col justify-between cursor-pointer"
            >
                <span className="block h-0.5 w-full bg-white"></span>
                <span className="block h-0.5 w-full bg-white"></span>
                <span className="block h-0.5 w-full bg-white"></span>
            </button>

            {/* Panneau plein écran noir affiché seulement si isOpen */}
            {isOpen && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center gap-10">

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Fermer le menu"
                        className="absolute top-6 right-6 text-white text-4xl cursor-pointer"
                    >
                        ✕
                    </button>

                    <nav className="flex flex-col items-center gap-8 text-white text-2xl">
                        {links.map((link) => (
                            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {isAuthenticated ? (
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); onLogout(); }}
                            aria-label="Se déconnecter"
                            className="w-12 h-12 p-1 cursor-pointer text-white"
                        >
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" className="w-full h-full">
                                <path d="M35 15H45C46.1046 15 47 15.8954 47 17V43C47 44.1046 46.1046 45 45 45H35"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13 30H35M13 30L21 22M13 30L21 38"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    ) : (
                        <Link to={loginPath} onClick={() => setIsOpen(false)} aria-label="Accéder à la connexion admin" className="w-12 h-12 p-1 text-white">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" className="w-full h-full">
                                <path d="M49.3176 51.1175C48.1801 47.9275 45.6676 45.11 42.1751 43.1C38.6826 41.09 34.4026 40 30.0001 40C25.5976 40 21.3176 41.09 17.8251 43.1C14.3326 45.11 11.8201 47.9275 10.6826 51.1175"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M30 30C35.5228 30 40 25.5228 40 20C40 14.4772 35.5228 10 30 10C24.4772 10 20 14.4772 20 20C20 25.5228 24.4772 30 30 30Z"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </Link>
                    )}
                </div>
            )}
        </>
    );
}