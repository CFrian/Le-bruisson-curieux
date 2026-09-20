// Page publique listant les projets, avec filtre par tag (dans le tableau "stack").
// Les projets viennent de MongoDB via l'API.

import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Btn from "../../components/Btn";
import api from "../../api/axiosConfig";

export default function ProjectsPage() {

    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/api/projects')
            .then((response) => {
                setProjects(response.data);
            })
            .catch(() => {
                setError("Impossible de charger les projets.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    let visibleProjects;

    if (filter === null) {
        visibleProjects = projects;
    } else {
        visibleProjects = projects.filter((project) => {
            return project.stack.includes(filter);
        });
    }

    if (loading) {
        return <p className="text-center pt-15">Chargement...</p>;
    }

    if (error) {
        return <p className="text-center pt-15 text-red-600">{error}</p>;
    }

    return (
        <div className="flex flex-col items-center gap-8 p-6 pt-15">

            {/* Boutons de filtre   chaque clic met à jour le state "filter" */}
            <div className="flex flex-wrap justify-center gap-5">
                <Btn
                    contenu="Tous les projets"
                    onClick={() => setFilter(null)}
                />
                <Btn
                    contenu="Développement"
                    onClick={() => setFilter("dev")}
                />
                <Btn
                    contenu="Audio"
                    onClick={() => setFilter("audio")}
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