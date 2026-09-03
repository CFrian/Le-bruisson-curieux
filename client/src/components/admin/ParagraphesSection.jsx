// Section de gestion des paragraphes d'un chapitre : liste, ajout, suppression.
// Imbriquée dans ChapitresSection.jsx, un exemplaire par chapitre affiché.
// La liste des paragraphes existants est affichée avant le formulaire d'ajout,
// même logique que ChapitresSection.jsx.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import Btn from "../Btn";
import FormInput from "../FormInput";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import MediaSection from "./MediaSection";

export default function ParagraphesSection({ idArticle, idChapitre }) {

    const [paragraphes, setParagraphes] = useState([]);
    const [contenuParagraphe, setContenuParagraphe] = useState("");
    const [ordreParagraphe, setOrdreParagraphe] = useState("1");
    const [submitting, setSubmitting] = useState(false);
    const [paragrapheToDelete, setParagrapheToDelete] = useState(null);

    const fetchParagraphes = () => {
        api.get(`/api/articles/${idArticle}/chapitres/${idChapitre}/paragraphes`)
            .then((response) => setParagraphes(response.data))
            .catch(() => toast.error("Impossible de charger les paragraphes."));
    };

    useEffect(() => {
        fetchParagraphes();
    }, [idChapitre]);

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post(`/api/articles/${idArticle}/chapitres/${idChapitre}/paragraphes`, {
                contenuParagraphe,
                ordreParagraphe: Number(ordreParagraphe),
            });
            toast.success("Paragraphe ajouté.");
            setContenuParagraphe("");
            setOrdreParagraphe("1");
            fetchParagraphes();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de l'ajout.");
        } finally {
            setSubmitting(false);
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

            {/* Liste des paragraphes existants — affichée en premier */}
            <div className="flex flex-col gap-2">
                {paragraphes.map((paragraphe) => (
                    <div key={paragraphe.idParagraphe} className="flex flex-col gap-2">
                        <div className="shadow-card p-3 flex justify-between items-center">
                            <p className="text-sm">
                                Paragraphe {paragraphe.ordreParagraphe}. {paragraphe.contenuParagraphe.slice(0, 60)}...
                            </p>
                            <Btn contenu="Supprimer" onClick={() => setParagrapheToDelete(paragraphe)} />
                        </div>

                        <MediaSection idArticle={idArticle} idChapitre={idChapitre} idParagraphe={paragraphe.idParagraphe} />
                    </div>
                ))}
            </div>
            <hr />
            {/* Formulaire d'ajout — affiché après */}
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
                <h3 className="font-bold">Ajouter un paragraphe</h3>
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
                <Btn contenu={submitting ? "Ajout..." : "Ajouter le paragraphe"} type="submit" />
            </form>

            <ConfirmDeleteModal
                isOpen={paragrapheToDelete !== null}
                itemLabel={`Paragraphe ${paragrapheToDelete?.ordreParagraphe}`}
                onConfirm={handleDelete}
                onCancel={() => setParagrapheToDelete(null)}
            />
        </div>
    );
}