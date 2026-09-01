// Page "À propos" du Blog.
// Prévu : un lien dans le texte renverra vers /prestations (zone Portfolio).

import { Link } from "react-router-dom";

export default function AproposPage() {
    return (
        <div className="flex flex-col gap-6 p-6 pt-15 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold">À propos</h1>
            <p>
                Le Bruisson Curieux est un espace consacré à l'analyse sonore dans les jeux vidéo,
                films et séries — sound design, musique, bruitage, prise de son.
            </p>
            <p>
                Je suis aussi développeur web.{" "}
                <Link to="/prestations" className="underline hover:opacity-70">
                    Découvrir mes prestations
                </Link>.
            </p>
        </div>
    );
}