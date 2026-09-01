// Section de gestion des chapitres d'un article : liste, ajout, suppression.
// Rendue uniquement quand idArticle existe (contrôlé par le parent ArticleFormPage).

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import Btn from "../Btn";
import FormInput from "../FormInput";
import ParagraphesSection from "./ParagraphesSection";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

export default function ChapitresSection({ idArticle }) {

    const [chapitres, setChapitres] = useState([]);
    const [titreChap, setTitreChap] = useState("");
    const [ordreChap, setOrdreChap] = useState("1");
    const [submitting, setSubmitting] = useState(false);
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

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post(`/api/articles/${idArticle}/chapitres`, {
                titreChap,
                ordreChap: Number(ordreChap),
            });
            toast.success("Chapitre ajouté.");
            setTitreChap("");
            setOrdreChap("");
            fetchChapitres();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de l'ajout.");
        } finally {
            setSubmitting(false);
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

            <form onSubmit={handleAdd} className="flex flex-col gap-3">
                <FormInput
                    label="Titre du chapitre"
                    id="titreChap"
                    value={titreChap}
                    onChange={(e) => setTitreChap(e.target.value)}
                    required={false}
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
                />
                <Btn contenu={submitting ? "Ajout..." : "Ajouter le chapitre"} type="submit" />
            </form>

            <div className="flex flex-col gap-3">
                {chapitres.map((chapitre) => (
                    <div key={chapitre.idChapitre} className="flex flex-col gap-2">
                        <div className="shadow-card p-4 flex justify-between items-center">
                            <p>{chapitre.ordreChap}. {chapitre.titreChap || "(sans titre)"}</p>
                            <Btn contenu="Supprimer" onClick={() => setChapitreToDelete(chapitre)} />
                        </div>

                        <ParagraphesSection idArticle={idArticle} idChapitre={chapitre.idChapitre} />
                    </div>
                ))}
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