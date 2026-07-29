// Btn.jsx
// Bouton générique réutilisable.
// - path fourni → rendu comme un Link (navigation)
// - sinon → rendu comme un <button> classique (action locale : onClick)
// - variant="danger" → style rouge pour les actions destructives (suppression)


import { Link } from "react-router-dom"

export default function Btn({ contenu, onClick, path, type = "button", variant = "default" }) {
    const baseClassName = "m-5 text-2xl shadow-cta hover:shadow-card transition-shadow duration-200 p-3 flex flex-col items-center w-fit cursor-pointer"

    // Variante visuelle : "danger" pour les actions destructives (supprimer)
    const variantClassName = variant === "danger"
        ? "bg-red-600 text-white hover:bg-red-700"
        : ""

    const className = `${baseClassName} ${variantClassName}`

    if (path) {
        return (
            <Link to={path} className={className}>
                {contenu}
            </Link>
        )
    }

    return (
        <button type={type} onClick={onClick} className={className}>
            {contenu}
        </button>
    )
}