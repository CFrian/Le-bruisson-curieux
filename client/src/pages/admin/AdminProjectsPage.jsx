// AdminProjectsPage.jsx
// Liste des projets côté admin — permet d'éditer ou supprimer chaque projet.
// Route protégée (à vérifier via ta logique de route privée / AuthContext).

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import Btn from "../../components/Btn";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import BackToDashboard from "../../components/BackToDashboard";


export default function AdminProjectsPage() {
    // Liste complète des projets récupérés depuis l'API
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stocke le projet actuellement ciblé pour suppression (null = modale fermée)
    const [projectToDelete, setProjectToDelete] = useState(null);

    // Fonction séparée (pas juste dans useEffect) pour pouvoir la rappeler
    // après une suppression, sans dupliquer la logique de fetch.
    const fetchProjects = () => {
        setLoading(true);
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
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Ouvre la modale de confirmation pour un projet précis
    const handleDeleteClick = (project) => {
        setProjectToDelete(project);
    };

    // Ferme la modale sans rien supprimer
    const handleCancelDelete = () => {
        setProjectToDelete(null);
    };

    // Confirme la suppression : appelle l'API DELETE, puis rafraîchit la liste
    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/api/projects/${projectToDelete._id}`);
            toast.success("Projet supprimé avec succès.");
            setProjectToDelete(null); // ferme la modale
            fetchProjects(); // recharge la liste à jour
        } catch (err) {
            toast.error("Erreur lors de la suppression.");
        }
    };

    if (loading) return <p className="text-center pt-15">Chargement...</p>;
    if (error) return <p className="text-center pt-15 text-red-600">{error}</p>;

    return (
        <div className="flex flex-col items-center gap-8 p-6 pt-15">
            <BackToDashboard />

            <div className="flex justify-between items-center w-full max-w-4xl">
                <h1 className="text-3xl font-bold">Gestion des projets</h1>
                <Btn contenu="Ajouter un projet" path="/admin/projets/nouveau" />
            </div>

            <div className="flex flex-col gap-4 w-full max-w-4xl">
                {projects.map((project) => (
                    <div
                        key={project._id}
                        className="shadow-card p-4 flex justify-between items-center"
                    >
                        <div>
                            <h3 className="pl-10 text-xl font-bold">{project.titre}</h3>
                        </div>

                        <div className="flex gap-3">
                            <Btn contenu="Modifier" path={`/admin/projets/${project._id}/modifier`} />
                            <Btn contenu="Supprimer" onClick={() => handleDeleteClick(project)} variant="danger" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Modale de confirmation — affichée uniquement si projectToDelete n'est pas null */}
            <ConfirmDeleteModal
                isOpen={projectToDelete !== null}
                itemLabel={projectToDelete?.titre}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}