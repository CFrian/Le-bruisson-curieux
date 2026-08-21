// Page d'accueil de l'espace admin — navigation vers les différentes sections gérables.
// Protégée par authentification (à vérifier  !! via AuthContext/route protégée).

import { Link } from "react-router-dom";

const sections = [
    { id: "projets", title: "Projets", path: "/admin/projets", description: "Gérer les projets du portfolio" },
    { id: "cv", title: "CV", path: "/admin/cv", description: "Modifier le contenu du CV" },
    { id: "articles", title: "Articles", path: "/admin/articles", description: "Gérer les articles du blog (à venir)" },
    { id: "compte", title: "Mon compte", path: "/admin/compte", description: "Changer l'email ou le mot de passe" }
    
    // Soundboard — projet annexe en bonus
    // { id: "sonodeck", title: "Sonodeck", path: "/admin/sonodeck", description: "Gérer le catalogue de sons (à venir)" },
];

export default function DashboardPage() {
    return (

        <div className="flex flex-col items-center p-6 gap-8 pt-15">
            <h1 className="text-3xl font-bold">Tableau de bord</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl">
                {sections.map((section) => (
                    <Link
                        key={section.id}
                        to={section.path}
                        className="shadow-cta hover:shadow-card transition-shadow duration-200 p-6 flex flex-col items-center text-center gap-2"
                    >
                        <h2 className="text-xl font-bold">{section.title}</h2>
                        <p className="text-sm opacity-70">{section.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}