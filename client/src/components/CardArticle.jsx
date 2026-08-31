// Affiche un article de blog en carte : image, titre, extrait, auteur,
// durée de lecture, favori (géré en localStorage côté client, pas de compte requis),
// et tags. Structure propre à l'article, distincte de Card.jsx (prestations/projets).

import { useState } from "react";
import Btn from "./Btn";

export default function CardArticle({ idArticle, image, title, comment, auteur, dureeLecture, tags, path }) {

    // Favori stocké en localStorage — pas de backend, décision actée pour le blog
    const [isFavori, setIsFavori] = useState(() => {
        const favoris = JSON.parse(localStorage.getItem('articlesFavoris') || '[]');
        return favoris.includes(idArticle);
    });

    const toggleFavori = () => {
        const favoris = JSON.parse(localStorage.getItem('articlesFavoris') || '[]');
        const updated = isFavori
            ? favoris.filter((id) => id !== idArticle)
            : [...favoris, idArticle];
        localStorage.setItem('articlesFavoris', JSON.stringify(updated));
        setIsFavori(!isFavori);
    };

    return (
        <div className="shadow-cta p-6 flex flex-col items-center w-87.5 h-112.5 gap-4">
            <div className="relative w-full h-40">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <button
                    onClick={toggleFavori}
                    aria-label={isFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
                    className="absolute top-2 right-2 text-2xl cursor-pointer"
                >
                    {isFavori ? "★" : "☆"}
                </button>
            </div>

            <div className="flex flex-col justify-center flex-1 gap-1">
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-sm opacity-70">{auteur} · {dureeLecture} min</p>
                <p className="text-[1.1rem]">{comment}</p>
                {tags && <p className="italic text-sm mt-2">{tags}</p>}
            </div>

            {path && <Btn contenu="Lire l'article" path={path} />}
        </div>
    );
}