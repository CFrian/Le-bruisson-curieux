// Affiche un article de blog en carte : image avec badge durée + favori en overlay,
// titre, extrait, bouton "Lire l'article", puis date/tag/auteur en pied de carte.
// Favori géré en localStorage côté client (pas de compte requis).
// Icônes en SVG inline (fournies par le porteur du projet, Font Awesome).
// Animation favori : icône "+" tourne à 180° en disparaissant, icône "check"
// apparaît en tournant jusqu'à 90° — les deux icônes se superposent, seule
// l'opacité/rotation change selon isFavori.

import { useState } from "react";
import Btn from "./Btn";

export default function CardArticle({ idArticle, image, title, comment, auteur, dureeLecture, tags, date, path }) {

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

    const premierTag = tags?.split(" - ")[0];

    return (
        <div className="shadow-cta flex flex-col w-87.5 h-112.5 overflow-hidden">
            <div className="relative w-full h-56">
                <img src={image} alt={title} className="w-full h-full object-cover" />

                {/* Badge durée de lecture */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-sm px-2 py-1">
                    <svg width="16" height="16" viewBox="0 0 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3.125V21.875C2 22.7038 2.35119 23.4987 2.97631 24.0847C3.60143 24.6708 4.44928 25 5.33333 25H21.1667C21.3877 25 21.5996 24.9177 21.7559 24.7712C21.9122 24.6247 22 24.426 22 24.2188C22 24.0115 21.9122 23.8128 21.7559 23.6663C21.5996 23.5198 21.3877 23.4375 21.1667 23.4375H5.33333C4.89131 23.4375 4.46738 23.2729 4.15482 22.9799C3.84226 22.6868 3.66667 22.2894 3.66667 21.875H20.3333C20.7754 21.875 21.1993 21.7104 21.5118 21.4174C21.8244 21.1243 22 20.7269 22 20.3125V3.125C22 2.2962 21.6488 1.50134 21.0237 0.915291C20.3986 0.32924 19.5507 0 18.6667 0H5.33333C4.44928 0 3.60143 0.32924 2.97631 0.915291C2.35119 1.50134 2 2.2962 2 3.125ZM18.6667 1.5625C19.1087 1.5625 19.5326 1.72712 19.8452 2.02015C20.1577 2.31317 20.3333 2.7106 20.3333 3.125V20.3125H3.66667V3.125C3.66667 2.7106 3.84226 2.31317 4.15482 2.02015C4.46738 1.72712 4.89131 1.5625 5.33333 1.5625H18.6667ZM12 6.25C10.6739 6.25 9.40215 6.74386 8.46447 7.62294C7.52678 8.50201 7 9.6943 7 10.9375C7 12.1807 7.52678 13.373 8.46447 14.2521C9.40215 15.1311 10.6739 15.625 12 15.625C13.3261 15.625 14.5979 15.1311 15.5355 14.2521C16.4732 13.373 17 12.1807 17 10.9375C17 9.6943 16.4732 8.50201 15.5355 7.62294C14.5979 6.74386 13.3261 6.25 12 6.25ZM5.33333 10.9375C5.33333 9.2799 6.03571 7.69018 7.28595 6.51808C8.5362 5.34598 10.2319 4.6875 12 4.6875C13.7681 4.6875 15.4638 5.34598 16.714 6.51808C17.9643 7.69018 18.6667 9.2799 18.6667 10.9375C18.6667 12.5951 17.9643 14.1848 16.714 15.3569C15.4638 16.529 13.7681 17.1875 12 17.1875C10.2319 17.1875 8.5362 16.529 7.28595 15.3569C6.03571 14.1848 5.33333 12.5951 5.33333 10.9375ZM12 8.59375C12 8.38655 11.9122 8.18784 11.7559 8.04132C11.5996 7.89481 11.3877 7.8125 11.1667 7.8125C10.9457 7.8125 10.7337 7.89481 10.5774 8.04132C10.4211 8.18784 10.3333 8.38655 10.3333 8.59375V11.7188C10.3333 11.926 10.4211 12.1247 10.5774 12.2712C10.7337 12.4177 10.9457 12.5 11.1667 12.5H13.6667C13.8877 12.5 14.0996 12.4177 14.2559 12.2712C14.4122 12.1247 14.5 11.926 14.5 11.7188C14.5 11.5115 14.4122 11.3128 14.2559 11.1663C14.0996 11.0198 13.8877 10.9375 13.6667 10.9375H12V8.59375Z" />
                    </svg>
                    <span>{dureeLecture} min</span>
                </div>

                {/* Favori — plus/check superposés, transition d'opacité + rotation */}
                <button
                    onClick={toggleFavori}
                    aria-label={isFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
                    className="absolute top-2 right-2 w-6 h-6 text-black cursor-pointer"
                >
                    <svg
                        viewBox="0 0 640 640"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`absolute inset-0 transition-all duration-300 ${isFavori ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}
                    >
                        <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" />
                    </svg>
                    <svg
                        viewBox="0 0 640 640"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`absolute inset-0 transition-all duration-300 ${isFavori ? 'rotate-90 opacity-100' : 'rotate-0 opacity-0'}`}
                    >
                        <path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z" />
                    </svg>
                </button>
            </div>

            <div className="flex flex-col items-center text-center gap-2 p-4 flex-1">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm opacity-70">{comment}</p>
                {path && <Btn contenu="Lire l'article" path={path} />}
            </div>

            <div className="flex justify-between items-center text-sm px-4 pb-4">
                <span>{date}</span>
                {premierTag && <span className="font-bold">#{premierTag}</span>}
                <span className="italic">{auteur}</span>
            </div>
        </div>
    );
}