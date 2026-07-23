// Navbar.jsx
// Navigation principale + accès connexion admin.

import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <header>
            <nav className='h-20 pr-10 pl-10 grid grid-cols-3 bg-black text-white text-2xl items-center'>

                <div className='text-right mr-40'>
                    <Link to="/">Florian Costes</Link>
                </div>

                <div className='flex gap-20 justify-center'>
                    {/* Liens internes (react-router) : PAS de risque de reverse tabnabbing,
                        cette règle ne concerne que les liens externes en target="_blank". */}
                    <Link className='opacity-50 hover:opacity-100' to="/">Prestations</Link>
                    <Link className='opacity-50 hover:opacity-100' to="/projets">Projets</Link>
                    <Link className='opacity-50 hover:opacity-100' to="/formation">Formation</Link>
                </div>

                {/* Lien vers connexion admin.
                    aria-label obligatoire ici : le contenu du lien est un SVG,
                    sans texte alternatif un lecteur d'écran n'annoncerait rien du tout. */}
                <Link to="/admin/login" className='ml-auto' aria-label="Accéder à la connexion admin ">
                    <svg
                        width="60" height="60" viewBox="0 0 60 60" fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img" // indique explicitement au lecteur d'écran : "ceci est une image porteuse de sens"
                        className="w-12 h-12 p-1 rounded-xl cursor-pointer opacity-50 hover:opacity-100"                    >
                        <path d="M49.3176 51.1175C48.1801 47.9275 45.6676 45.11 42.1751 43.1C38.6826 41.09 34.4026 40 30.0001 40C25.5976 40 21.3176 41.09 17.8251 43.1C14.3326 45.11 11.8201 47.9275 10.6826 51.1175"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M30 30C35.5228 30 40 25.5228 40 20C40 14.4772 35.5228 10 30 10C24.4772 10 20 14.4772 20 20C20 25.5228 24.4772 30 30 30Z"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </Link>
            </nav>
        </header>
    )
}