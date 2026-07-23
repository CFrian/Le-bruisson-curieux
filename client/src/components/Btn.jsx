// Btn.jsx
import { Link } from "react-router-dom"

export default function Btn({ contenu, onClick, path }) {
    const className = "mb-10 text-2xl shadow-cta hover:shadow-card transition-shadow duration-200 p-3 flex flex-col items-center w-fit cursor-pointer"

    // Si un "path" est fourni → comportement navigation (Link react-router)
    if (path) {
        return (
            <Link to={path} className={className}>
                {contenu}
            </Link>
        )
    }

    // Sinon → comportement action locale (ex: "afficher plus", toggle, etc.)
    return (
        <button type="button" onClick={onClick} className={className}>
            {contenu}
        </button>
    )
}