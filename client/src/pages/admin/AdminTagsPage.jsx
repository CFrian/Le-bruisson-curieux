// Page admin de gestion des tags : liste, ajout, modification inline, suppression.
// Le formulaire d'édition apparaît directement sous le tag cliqué (lien visuel direct),
// distinct du formulaire d'ajout toujours affiché en haut.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import Btn from "../../components/Btn";
import FormInput from "../../components/FormInput";
import BackToDashboard from "../../components/BackToDashboard";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

export default function AdminTagsPage() {

    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Formulaire d'ajout (toujours en haut, jamais pré-rempli)
    const [nomTag, setNomTag] = useState("");
    const [slugTag, setSlugTag] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Formulaire d'édition inline — état séparé, propre au tag en cours de modification
    const [editingTag, setEditingTag] = useState(null);
    const [editNomTag, setEditNomTag] = useState("");
    const [editSlugTag, setEditSlugTag] = useState("");
    const [editSubmitting, setEditSubmitting] = useState(false);

    const [tagToDelete, setTagToDelete] = useState(null);

    const fetchTags = () => {
        api.get('/api/tags')
            .then((response) => {
                setTags(response.data);
            })
            .catch(() => {
                setError("Impossible de charger les tags.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post('/api/tags', { nomTag, slugTag });
            toast.success("Tag créé avec succès.");
            setNomTag("");
            setSlugTag("");
            fetchTags();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la création.");
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (tag) => {
        setEditingTag(tag);
        setEditNomTag(tag.nomTag);
        setEditSlugTag(tag.slugTag);
    };

    const cancelEdit = () => {
        setEditingTag(null);
        setEditNomTag("");
        setEditSlugTag("");
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setEditSubmitting(true);

        try {
            await api.put(`/api/tags/${editingTag.idTag}`, { nomTag: editNomTag, slugTag: editSlugTag });
            toast.success("Tag modifié avec succès.");
            cancelEdit();
            fetchTags();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la modification.");
        } finally {
            setEditSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/tags/${tagToDelete.idTag}`);
            setTagToDelete(null);
            fetchTags();
        } catch (err) {
            toast.error(err.response?.data?.message || "Impossible de supprimer ce tag.");
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

            <h1 className="text-3xl font-bold">Tags</h1>

            {/* Formulaire d'ajout — toujours en haut, jamais pré-rempli */}
            <form onSubmit={handleAdd} className="shadow-card p-5 flex flex-col gap-4">
                <h2 className="font-bold">Ajouter un tag</h2>
                <FormInput
                    label="Nom"
                    id="nomTag"
                    value={nomTag}
                    onChange={(e) => setNomTag(e.target.value)}
                    placeholder="sound design"
                />
                <FormInput
                    label="Slug"
                    id="slugTag"
                    value={slugTag}
                    onChange={(e) => setSlugTag(e.target.value)}
                    placeholder="sound-design"
                />
                <Btn
                    contenu={submitting ? "Ajout..." : "Ajouter le tag"}
                    type="submit"
                />
            </form>

            {/* Liste des tags — le formulaire d'édition apparaît juste sous le tag cliqué */}
            <div className="flex flex-col gap-3">
                {tags.map((tag) => (
                    <div key={tag.idTag} className="flex flex-col gap-2">
                        <div className="shadow-card p-4 flex justify-between items-center">
                            <p className="font-bold">{tag.nomTag}</p>
                            <div className="flex gap-2">
                                <Btn contenu="Modifier" onClick={() => startEdit(tag)} />
                                <Btn contenu="Supprimer" onClick={() => setTagToDelete(tag)} />
                            </div>
                        </div>

                        {editingTag?.idTag === tag.idTag && (
                            <form
                                onSubmit={handleEdit}
                                className="shadow-card p-5 flex flex-col gap-4 border-l-4 border-orange-500"
                            >
                                <h2 className="font-bold">Modifier le tag</h2>
                                <FormInput
                                    label="Nom"
                                    id={`editNomTag-${tag.idTag}`}
                                    value={editNomTag}
                                    onChange={(e) => setEditNomTag(e.target.value)}
                                />
                                <FormInput
                                    label="Slug"
                                    id={`editSlugTag-${tag.idTag}`}
                                    value={editSlugTag}
                                    onChange={(e) => setEditSlugTag(e.target.value)}
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
                isOpen={tagToDelete !== null}
                itemLabel={tagToDelete?.nomTag}
                onConfirm={handleDelete}
                onCancel={() => setTagToDelete(null)}
            />
        </div>
    );
}