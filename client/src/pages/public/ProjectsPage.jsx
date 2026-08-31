// Page publique listant les projets, avec filtre simple par tag (dans le tableau "stack").
// Les projets viennent de MongoDB via l'API (CRUD déjà en place côté back).

import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Btn from "../../components/Btn";
import api from "../../api/axiosConfig";

export default function ProjectsPage() {

    // Liste complète des projets récupérés depuis l'API
    const [projects, setProjects] = useState([]);

    // Filtre actif : null = aucun filtre (tous les projets affichés)
    // "dev" ou "audio" = uniquement les projets dont le tableau "stack" contient ce tag
    const [filter, setFilter] = useState(null);

    // Indique si la requête API est en cours (affiche un message de chargement)
    const [loading, setLoading] = useState(true);

    // Stocke un message d'erreur si la requête API échoue
    const [error, setError] = useState(null);

    // useEffect avec tableau de dépendances vide [] → s'exécute une seule fois,
    // au tout premier rendu du composant (équivalent de componentDidMount)
    useEffect(() => {
        api.get('/api/projects')
            .then((response) => {
                // response.data contient le tableau de projets renvoyé par le back
                setProjects(response.data);
            })
            .catch(() => {
                setError("Impossible de charger les projets.");
            })
            .finally(() => {
                // S'exécute que la requête réussisse ou échoue → arrête le loading dans tous les cas
                setLoading(false);
            });
    }, []);

    // Calcule la liste de projets à afficher selon le filtre actif.
    // Écrit en if/else explicite plutôt qu'en ternaire condensé, pour rester lisible.
    let visibleProjects;

    if (filter === null) {
        // Aucun filtre sélectionné → on affiche tous les projets
        visibleProjects = projects;
    } else {
        // Un filtre est actif → on ne garde que les projets dont le tableau "stack"
        // contient le tag recherché (ex: "audio" ou "dev")
        visibleProjects = projects.filter((project) => {
            return project.stack.includes(filter);
        });
    }

    // Affichage pendant le chargement de la requête API
    if (loading) {
        return <p className="text-center pt-15">Chargement...</p>;
    }

    // Affichage si la requête API a échoué
    if (error) {
        return <p className="text-center pt-15 text-red-600">{error}</p>;
    }

    return (
        <div className="flex flex-col items-center gap-8 p-6 pt-15">

            {/* Boutons de filtre — chaque clic met à jour le state "filter" */}
            <div className="flex gap-5">
                <Btn
                    contenu="Développement"
                    onClick={() => setFilter("dev")}
                />
                <Btn
                    contenu="Audio"
                    onClick={() => setFilter("audio")}
                />
                <Btn
                    contenu="Tous les projets"
                    onClick={() => setFilter(null)}
                />
            </div>

            {/* Grille de projets, recalculée automatiquement à chaque changement de filtre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-40">
                {visibleProjects.map((project) => {
                    return (
                        <Card
                            key={project._id}
                            image={project.image}
                            title={project.titre}
                            comment={project.description}
                            stacks={project.stack.join(" - ")}
                            lienDemo={project.lienDemo}
                            lienRepo={project.lienRepo}
                        />
                    );
                })}
            </div>
        </div>
    );
}