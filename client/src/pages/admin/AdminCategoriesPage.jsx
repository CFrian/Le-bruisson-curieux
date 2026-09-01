// Page admin de gestion des catégories : liste, ajout, modification inline, suppression.
// Le formulaire d'édition apparaît directement sous la catégorie cliquée (lien visuel direct),
// distinct du formulaire d'ajout toujours affiché en haut.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import Btn from "../../components/Btn";
import FormInput from "../../components/FormInput";
import BackToDashboard from "../../components/BackToDashboard";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

export default function AdminCategoriesPage() {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Formulaire d'ajout (toujours en haut, jamais pré-rempli)
    const [nomCategorie, setNomCategorie] = useState("");
    const [slugCategorie, setSlugCategorie] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Formulaire d'édition inline — état séparé, propre à la catégorie en cours de modification
    const [editingCategorie, setEditingCategorie] = useState(null);
    const [editNomCategorie, setEditNomCategorie] = useState("");
    const [editSlugCategorie, setEditSlugCategorie] = useState("");
    const [editSubmitting, setEditSubmitting] = useState(false);

    const [categorieToDelete, setCategorieToDelete] = useState(null);

    const fetchCategories = () => {
        api.get('/api/categories')
            .then((response) => {
                setCategories(response.data);
            })
            .catch(() => {
                setError("Impossible de charger les catégories.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post('/api/categories', { nomCategorie, slugCategorie });
            toast.success("Catégorie créée avec succès.");
            setNomCategorie("");
            setSlugCategorie("");
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la création.");
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (categorie) => {
        setEditingCategorie(categorie);
        setEditNomCategorie(categorie.nomCategorie);
        setEditSlugCategorie(categorie.slugCategorie);
    };

    const cancelEdit = () => {
        setEditingCategorie(null);
        setEditNomCategorie("");
        setEditSlugCategorie("");
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setEditSubmitting(true);

        try {
            await api.put(`/api/categories/${editingCategorie.idCategorie}`, {
                nomCategorie: editNomCategorie,
                slugCategorie: editSlugCategorie,
            });
            toast.success("Catégorie modifiée avec succès.");
            cancelEdit();
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la modification.");
        } finally {
            setEditSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/categories/${categorieToDelete.idCategorie}`);
            setCategorieToDelete(null);
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || "Impossible de supprimer cette catégorie.");
        }
    };

    if (loading) {
        return <p className="text-center pt-15">Chargement...</p>;
    }

    if (error) {
        return <p className="text-center pt-15 text-red-600">{error}</p>;
    }

    return (
        <div className="flex flex-col gap-6 p-6 pt-15 max-w-2xl mx-auto">
            <BackToDashboard />

            <h1 className="text-3xl font-bold">Catégories</h1>

            {/* Formulaire d'ajout — toujours en haut, jamais pré-rempli */}
            <form onSubmit={handleAdd} className="shadow-card p-5 flex flex-col gap-4">
                <h2 className="font-bold">Ajouter une catégorie</h2>
                <FormInput
                    label="Nom"
                    id="nomCategorie"
                    value={nomCategorie}
                    onChange={(e) => setNomCategorie(e.target.value)}
                    placeholder="Jeu vidéo"
                />
                <FormInput
                    label="Slug"
                    id="slugCategorie"
                    value={slugCategorie}
                    onChange={(e) => setSlugCategorie(e.target.value)}
                    placeholder="jeu-video"
                />
                <Btn
                    contenu={submitting ? "Ajout..." : "Ajouter la catégorie"}
                    type="submit"
                />
            </form>

            {/* Liste des catégories — le formulaire d'édition apparaît juste sous la catégorie cliquée */}
            <div className="flex flex-col gap-3">
                {categories.map((categorie) => (
                    <div key={categorie.idCategorie} className="flex flex-col gap-2">
                        <div className="shadow-card p-4 flex justify-between items-center">
                            <p className="font-bold">{categorie.nomCategorie}</p>
                            <div className="flex gap-2">
                                <Btn contenu="Modifier" onClick={() => startEdit(categorie)} />
                                <Btn contenu="Supprimer" onClick={() => setCategorieToDelete(categorie)} />
                            </div>
                        </div>

                        {editingCategorie?.idCategorie === categorie.idCategorie && (
                            <form
                                onSubmit={handleEdit}
                                className="shadow-card p-5 flex flex-col gap-4 border-l-4 border-orange-500"
                            >
                                <h2 className="font-bold">Modifier la catégorie</h2>
                                <FormInput
                                    label="Nom"
                                    id={`editNomCategorie-${categorie.idCategorie}`}
                                    value={editNomCategorie}
                                    onChange={(e) => setEditNomCategorie(e.target.value)}
                                />
                                <FormInput
                                    label="Slug"
                                    id={`editSlugCategorie-${categorie.idCategorie}`}
                                    value={editSlugCategorie}
                                    onChange={(e) => setEditSlugCategorie(e.target.value)}
                                />
                                <div className="flex gap-3">
                                    <Btn
                                        contenu={editSubmitting ? "Enregistrement..." : "Enregistrer"}
                                        type="submit"
                                    />
                                    <Btn contenu="Annuler" onClick={cancelEdit} type="button" />
                                </div>
                            </form>
                        )}
                    </div>
                ))}
            </div>

            <ConfirmDeleteModal
                isOpen={categorieToDelete !== null}
                itemLabel={categorieToDelete?.nomCategorie}
                onConfirm={handleDelete}
                onCancel={() => setCategorieToDelete(null)}
            />
        </div>
    );
}