// Section de gestion des chapitres d'un article : liste, ajout, modification inline, suppression.
// Rendue uniquement quand idArticle existe (contrôlé par le parent ArticleFormPage).
// Bordure orange sur les champs pour repérer visuellement la zone "chapitres"
// dans le formulaire complet de l'article.
// La liste des chapitres existants est affichée avant le formulaire d'ajout.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import Btn from "../Btn";
import FormInput from "../FormInput";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import ParagraphesSection from "./ParagraphesSection";
import MediaSection from "./MediaSection";

const ORANGE_BORDER = "border-2 border-orange-500";

export default function ChapitresSection({ idArticle }) {

    const [chapitres, setChapitres] = useState([]);

    // Formulaire d'ajout
    const [titreChap, setTitreChap] = useState("");
    const [ordreChap, setOrdreChap] = useState("1");
    const [submitting, setSubmitting] = useState(false);

    // Formulaire d'édition inline — état séparé
    const [editingChapitre, setEditingChapitre] = useState(null);
    const [editTitreChap, setEditTitreChap] = useState("");
    const [editOrdreChap, setEditOrdreChap] = useState("1");
    const [editSubmitting, setEditSubmitting] = useState(false);

    const [chapitreToDelete, setChapitreToDelete] = useState(null);

    const fetchChapitres = () => {
        if (!idArticle) return;
        api.get(`/api/articles/${idArticle}/chapitres`)
            .then((response) => setChapitres(response.data))
            .catch(() => toast.error("Impossible de charger les chapitres."));
    };

    useEffect(() => {
        fetchChapitres();
    }, [idArticle]);

    const handleAdd = async () => {
        setSubmitting(true);

        try {
            await api.post(`/api/articles/${idArticle}/chapitres`, {
                titreChap,
                ordreChap: Number(ordreChap),
            });
            toast.success("Chapitre ajouté.");
            setTitreChap("");
            setOrdreChap("1");
            fetchChapitres();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de l'ajout.");
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (chapitre) => {
        setEditingChapitre(chapitre);
        setEditTitreChap(chapitre.titreChap || "");
        setEditOrdreChap(String(chapitre.ordreChap));
    };

    const cancelEdit = () => {
        setEditingChapitre(null);
        setEditTitreChap("");
        setEditOrdreChap("1");
    };

    const handleEdit = async () => {
        setEditSubmitting(true);

        try {
            await api.put(`/api/articles/${idArticle}/chapitres/${editingChapitre.idChapitre}`, {
                titreChap: editTitreChap,
                ordreChap: Number(editOrdreChap),
            });
            toast.success("Chapitre modifié.");
            cancelEdit();
            fetchChapitres();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la modification.");
        } finally {
            setEditSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/articles/${idArticle}/chapitres/${chapitreToDelete.idChapitre}`);
            setChapitreToDelete(null);
            fetchChapitres();
        } catch {
            toast.error("Impossible de supprimer ce chapitre.");
        }
    };

    return (
        <div className="shadow-2xl p-5 flex flex-col gap-5">
            <h2 className="text-xl font-bold">Chapitres</h2>

            <div className="flex flex-col gap-2">
                {chapitres.map((chapitre) => (
                    <div key={chapitre.idChapitre} className="flex flex-col gap-2">
                        <div className={`p-4 flex flex-col gap-2 ${ORANGE_BORDER}`}>
                            <p className="font-bold">
                                Chapitre {chapitre.ordreChap}. {chapitre.titreChap || "(sans titre)"}
                            </p>
                            <div className="flex gap-2">
                                <Btn contenu="Modifier" onClick={() => startEdit(chapitre)} type="button" />
                                <Btn contenu="Supprimer" onClick={() => setChapitreToDelete(chapitre)} type="button" />
                            </div>
                        </div>

                        {/* Formulaire d'édition inline — affiché seulement sous le chapitre cliqué */}
                        {editingChapitre?.idChapitre === chapitre.idChapitre && (
                            <div className="p-4 flex flex-col gap-3 border-l-4 border-blue-500">
                                <h4 className="font-bold">Modifier le chapitre</h4>
                                <FormInput
                                    label="Titre du chapitre"
                                    id={`editTitreChap-${chapitre.idChapitre}`}
                                    value={editTitreChap}
                                    onChange={(e) => setEditTitreChap(e.target.value)}
                                    required={false}
                                />
                                <FormInput
                                    label="Ordre"
                                    id={`editOrdreChap-${chapitre.idChapitre}`}
                                    type="number"
                                    min="1"
                                    value={editOrdreChap}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "" || (Number(value) >= 1 && Number.isInteger(Number(value)))) {
                                            setEditOrdreChap(value);
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

                        <ParagraphesSection idArticle={idArticle} idChapitre={chapitre.idChapitre} />
                        <MediaSection idArticle={idArticle} idChapitre={chapitre.idChapitre} />
                    </div>
                ))}
            </div>

            {/* Formulaire d'ajout — après la liste */}
            <div className="flex flex-col gap-3">
                <h3 className="font-bold">Ajouter un chapitre</h3>
                <FormInput
                    label="Titre du chapitre"
                    id="titreChap"
                    value={titreChap}
                    onChange={(e) => setTitreChap(e.target.value)}
                    required={false}
                    className={ORANGE_BORDER}
                />
                <FormInput
                    label="Ordre"
                    id="ordreChap"
                    type="number"
                    min="1"
                    value={ordreChap}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || (Number(value) >= 1 && Number.isInteger(Number(value)))) {
                            setOrdreChap(value);
                        }
                    }}
                    placeholder="1"
                    className={ORANGE_BORDER}
                />
                <Btn contenu={submitting ? "Ajout..." : "Ajouter le chapitre"} type="button" onClick={handleAdd} />
            </div>

            <ConfirmDeleteModal
                isOpen={chapitreToDelete !== null}
                itemLabel={chapitreToDelete?.titreChap || `Chapitre ${chapitreToDelete?.ordreChap}`}
                onConfirm={handleDelete}
                onCancel={() => setChapitreToDelete(null)}
            />
        </div>
    );
}