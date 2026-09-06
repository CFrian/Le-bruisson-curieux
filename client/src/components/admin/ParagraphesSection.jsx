// Section de gestion des paragraphes d'un chapitre : liste, ajout, modification inline, suppression.
// Imbriquée dans ChapitresSection.jsx, un exemplaire par chapitre affiché.
// Pas de <form> ici : imbriqué dans le <form> principal d'ArticleFormPage.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import Btn from "../Btn";
import FormInput from "../FormInput";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import MediaSection from "./MediaSection";

export default function ParagraphesSection({ idArticle, idChapitre }) {

    const [paragraphes, setParagraphes] = useState([]);

    // Formulaire d'ajout (toujours en bas, jamais pré-rempli)
    const [titreParagraphe, setTitreParagraphe] = useState("");
    const [contenuParagraphe, setContenuParagraphe] = useState("");
    const [ordreParagraphe, setOrdreParagraphe] = useState("1");
    const [submitting, setSubmitting] = useState(false);

    // Formulaire d'édition inline — état séparé, propre au paragraphe en cours de modification
    const [editingParagraphe, setEditingParagraphe] = useState(null);
    const [editTitreParagraphe, setEditTitreParagraphe] = useState("");
    const [editContenuParagraphe, setEditContenuParagraphe] = useState("");
    const [editOrdreParagraphe, setEditOrdreParagraphe] = useState("1");
    const [editSubmitting, setEditSubmitting] = useState(false);

    const [paragrapheToDelete, setParagrapheToDelete] = useState(null);

    const fetchParagraphes = () => {
        api.get(`/api/articles/${idArticle}/chapitres/${idChapitre}/paragraphes`)
            .then((response) => setParagraphes(response.data))
            .catch(() => toast.error("Impossible de charger les paragraphes."));
    };

    useEffect(() => {
        fetchParagraphes();
    }, [idChapitre]);

    const handleAdd = async () => {
        setSubmitting(true);

        try {
            await api.post(`/api/articles/${idArticle}/chapitres/${idChapitre}/paragraphes`, {
                titreParagraphe,
                contenuParagraphe,
                ordreParagraphe: Number(ordreParagraphe),
            });
            toast.success("Paragraphe ajouté.");
            setTitreParagraphe("");
            setContenuParagraphe("");
            setOrdreParagraphe("1");
            fetchParagraphes();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de l'ajout.");
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (paragraphe) => {
        setEditingParagraphe(paragraphe);
        setEditTitreParagraphe(paragraphe.titreParagraphe || "");
        setEditContenuParagraphe(paragraphe.contenuParagraphe);
        setEditOrdreParagraphe(String(paragraphe.ordreParagraphe));
    };

    const cancelEdit = () => {
        setEditingParagraphe(null);
        setEditTitreParagraphe("");
        setEditContenuParagraphe("");
        setEditOrdreParagraphe("1");
    };

    const handleEdit = async () => {
        setEditSubmitting(true);

        try {
            await api.put(`/api/articles/${idArticle}/chapitres/${idChapitre}/paragraphes/${editingParagraphe.idParagraphe}`, {
                titreParagraphe: editTitreParagraphe,
                contenuParagraphe: editContenuParagraphe,
                ordreParagraphe: Number(editOrdreParagraphe),
            });
            toast.success("Paragraphe modifié.");
            cancelEdit();
            fetchParagraphes();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la modification.");
        } finally {
            setEditSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/articles/${idArticle}/chapitres/${idChapitre}/paragraphes/${paragrapheToDelete.idParagraphe}`);
            setParagrapheToDelete(null);
            fetchParagraphes();
        } catch {
            toast.error("Impossible de supprimer ce paragraphe.");
        }
    };

    return (
        <div className="shadow-card p-4 flex flex-col gap-4 ml-4">
            <h3 className="font-bold">Paragraphes</h3>

            <div className="flex flex-col gap-2">
                {paragraphes.map((paragraphe) => (
                    <div key={paragraphe.idParagraphe} className="flex flex-col gap-2">
                        <div className="shadow-card p-3 flex flex-col gap-2">
                            <p className="font-bold text-sm">
                                Paragraphe {paragraphe.ordreParagraphe}
                                {paragraphe.titreParagraphe && ` — ${paragraphe.titreParagraphe}`}
                            </p>
                            <p className="whitespace-pre-wrap text-sm">{paragraphe.contenuParagraphe}</p>
                            <div className="flex gap-2">
                                <Btn contenu="Modifier" onClick={() => startEdit(paragraphe)} type="button" />
                                <Btn contenu="Supprimer" onClick={() => setParagrapheToDelete(paragraphe)} type="button" />
                            </div>
                        </div>

                        {/* Formulaire d'édition inline — affiché seulement sous le paragraphe cliqué */}
                        {editingParagraphe?.idParagraphe === paragraphe.idParagraphe && (
                            <div className="shadow-card p-4 flex flex-col gap-3 border-l-4 border-blue-500">
                                <h4 className="font-bold">Modifier le paragraphe</h4>
                                <FormInput
                                    label="Titre (optionnel)"
                                    id={`editTitreParagraphe-${paragraphe.idParagraphe}`}
                                    value={editTitreParagraphe}
                                    onChange={(e) => setEditTitreParagraphe(e.target.value)}
                                    required={false}
                                />
                                <FormInput
                                    label="Contenu"
                                    id={`editContenuParagraphe-${paragraphe.idParagraphe}`}
                                    as="textarea"
                                    value={editContenuParagraphe}
                                    onChange={(e) => setEditContenuParagraphe(e.target.value)}
                                />
                                <FormInput
                                    label="Ordre"
                                    id={`editOrdreParagraphe-${paragraphe.idParagraphe}`}
                                    type="number"
                                    min="1"
                                    value={editOrdreParagraphe}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "" || (Number(value) >= 1 && Number.isInteger(Number(value)))) {
                                            setEditOrdreParagraphe(value);
                                        }
                                    }}
                                />
                                <div className="flex gap-2">
                                    <Btn
                                        contenu={editSubmitting ? "Enregistrement..." : "Enregistrer"}
                                        type="button"
                                        onClick={handleEdit}
                                    />
                                    <Btn contenu="Annuler" onClick={cancelEdit} type="button" />
                                </div>
                            </div>
                        )}

                        <MediaSection idArticle={idArticle} idChapitre={idChapitre} idParagraphe={paragraphe.idParagraphe} />
                    </div>
                ))}
            </div>
            <hr />

            <div className="flex flex-col gap-3">
                <h3 className="font-bold">Ajouter un paragraphe</h3>
                <FormInput
                    label="Titre (optionnel)"
                    id={`titreParagraphe-${idChapitre}`}
                    value={titreParagraphe}
                    onChange={(e) => setTitreParagraphe(e.target.value)}
                    placeholder="Ex: Le Piano : Ton Compagnon d'Espoir"
                    required={false}
                />
                <FormInput
                    label="Ecrire un Paragraphe"
                    id={`contenuParagraphe-${idChapitre}`}
                    as="textarea"
                    value={contenuParagraphe}
                    onChange={(e) => setContenuParagraphe(e.target.value)}
                    placeholder="Texte du paragraphe"
                />
                <FormInput
                    label="Ordre"
                    id={`ordreParagraphe-${idChapitre}`}
                    type="number"
                    min="1"
                    value={ordreParagraphe}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || (Number(value) >= 1 && Number.isInteger(Number(value)))) {
                            setOrdreParagraphe(value);
                        }
                    }}
                    placeholder="1"
                />
                <Btn contenu={submitting ? "Ajout..." : "Ajouter le paragraphe"} type="button" onClick={handleAdd} />
            </div>

            <ConfirmDeleteModal
                isOpen={paragrapheToDelete !== null}
                itemLabel={`Paragraphe ${paragrapheToDelete?.ordreParagraphe}`}
                onConfirm={handleDelete}
                onCancel={() => setParagrapheToDelete(null)}
            />
        </div>
    );
}