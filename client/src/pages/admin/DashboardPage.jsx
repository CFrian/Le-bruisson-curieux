// Page d'accueil de l'espace admin — navigation vers les différentes sections gérables.
// Organisée en 3 blocs : Compte (transversal), Portfolio, Blog — pour cloisonner visuellement
// les deux univers gérés depuis un même espace admin. Séparateur vertical entre les deux colonnes.
// Protégée par authentification (à vérifier !! via AuthContext/route protégée).

import { Link } from "react-router-dom";

const accountSection = {
    id: "compte",
    title: "Mon compte",
    path: "/admin/compte",
    description: "Changer l'email ou le mot de passe"
};

const portfolioSections = [
    { id: "projets", title: "Projets", path: "/admin/projets", description: "Gérer les projets du portfolio" },
    { id: "cv", title: "CV", path: "/admin/cv", description: "Modifier le contenu du CV" },
];

const blogSections = [
    { id: "articles", title: "Articles", path: "/admin/articles", description: "Gérer les articles du blog" },
    { id: "tags", title: "Tags", path: "/admin/tags", description: "Gérer les tags des articles" },
    { id: "categories", title: "Catégories", path: "/admin/categories", description: "Gérer les catégories des articles" },

    // Soundboard — projet annexe en bonus
    // { id: "sonodeck", title: "Sonodeck", path: "/admin/sonodeck", description: "Gérer le catalogue de sons (à venir)" },
];

function SectionCard({ section }) {
    return (
        <Link
            to={section.path}
            className="shadow-cta hover:shadow-card transition-shadow duration-200 p-6 flex flex-col items-center text-center gap-2"
        >
            <h2 className="text-xl font-bold">{section.title}</h2>
            <p className="text-sm opacity-70">{section.description}</p>
        </Link>
    );
}

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center p-6 gap-8 pt-15">
            <h1 className="text-3xl font-bold">Tableau de bord</h1>

            <div className="w-full max-w-xs">
                <SectionCard section={accountSection} />
            </div>

            {/* Deux colonnes séparées par une ligne verticale (visible à partir de lg) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-black gap-10 w-full max-w-5xl">

                <div className="flex flex-col items-center gap-4 lg:pr-10">
                    <h2 className="text-2xl font-bold">Portfolio</h2>
                    <div className="flex flex-col gap-5 w-full max-w-xs">
                        {portfolioSections.map((section) => (
                            <SectionCard key={section.id} section={section} />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 lg:pl-10">
                    <h2 className="text-2xl font-bold">Blog</h2>
                    <div className="flex flex-col gap-5 w-full max-w-xs">
                        {blogSections.map((section) => (
                            <SectionCard key={section.id} section={section} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}