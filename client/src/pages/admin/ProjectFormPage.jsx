// ProjectFormPage.jsx
// Formulaire d'ajout OU de modification d'un projet, selon la présence d'un id dans l'URL.
// Route :id absent → création. Route :id présent → édition (pré-remplissage + PATCH).

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import FormInput from "../../components/FormInput";
import Btn from "../../components/Btn";

export default function ProjectFormPage() {
    // Si présent dans l'URL (/admin/projets/:id/modifier) → mode édition
    // Si absent (/admin/projets/nouveau) → mode création
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const navigate = useNavigate();

    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [stack, setStack] = useState(""); // saisi en texte "React, Node, dev", séparé par virgules
    const [lienDemo, setLienDemo] = useState("");
    const [lienRepo, setLienRepo] = useState("");
    const [loading, setLoading] = useState(false);

    // En mode édition, on charge les données existantes du projet pour pré-remplir le formulaire
    useEffect(() => {
        if (!isEditMode) return; // rien à charger en mode création

        api.get(`/api/projects/${id}`)
            .then((response) => {
                const project = response.data;
                setTitre(project.titre);
                setDescription(project.description);
                setStack(project.stack.join(", ")); // tableau → texte pour l'input
                setLienDemo(project.lienDemo || "");
                setLienRepo(project.lienRepo || "");
            })
            .catch(() => {
                toast.error("Impossible de charger le projet.");
            });
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Reconvertit le texte "React, Node, dev" en tableau ["React", "Node", "dev"]
        // .trim() enlève les espaces autour de chaque mot, .filter() retire les entrées vides
        const stackArray = stack
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

        const projectData = {
            titre,
            description,
            stack: stackArray,
            lienDemo,
            lienRepo
        };

        try {
            if (isEditMode) {
                await api.patch(`/api/projects/${id}`, projectData);
                toast.success("Projet modifié avec succès.");
            } else {
                await api.post('/api/projects', projectData);
                toast.success("Projet créé avec succès.");
            }
            navigate('/admin/projets');
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 p-6 pt-15">

            {/* Bouton retour vers la liste, toujours visible en haut de page */}
            <div className="w-full max-w-md">
                <Link to="/admin/projets" className="hover:opacity-70 transition-opacity duration-200">
                    ← Retour à la liste des projets
                </Link>
            </div>

            <h1 className="text-2xl font-bold">
                {isEditMode ? "Modifier le projet" : "Ajouter un projet"}
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-md p-5 shadow-2xl gap-5 flex flex-col">
                <FormInput
                    label="Titre"
                    id="titre"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    placeholder="Nom du projet"
                />
                <FormInput
                    label="Description"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description du projet"
                />
                <FormInput
                    label="Stack (séparée par des virgules)"
                    id="stack"
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                    placeholder="React, Node.js, MongoDB, dev"
                />
                <FormInput
                    label="Lien démo"
                    id="lienDemo"
                    value={lienDemo}
                    onChange={(e) => setLienDemo(e.target.value)}
                    placeholder="https://..."
                />
                <FormInput
                    label="Lien repo GitHub"
                    id="lienRepo"
                    value={lienRepo}
                    onChange={(e) => setLienRepo(e.target.value)}
                    placeholder="https://github.com/..."
                />

                <Btn
                    contenu={loading ? "Enregistrement..." : isEditMode ? "Enregistrer les modifications" : "Créer le projet"}
                    type="submit"
                />
            </form>
        </div>
    );
}