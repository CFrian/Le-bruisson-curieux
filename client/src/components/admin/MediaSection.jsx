// Section de gestion des médias : liste, ajout, suppression.
// Réutilisable à 3 niveaux (article / chapitre / paragraphe) selon les props reçues —
// un seul composant, pas de duplication entre les 3 contextes.
//
// Type "image" → upload réel via Cloudinary (réutilise ImageUploadInput, comme CV/Projets).
// Type "video"/"audio" → simple champ URL (YouTube/Vimeo/SoundCloud...), pas d'upload direct
// pour l'instant — décision actée pour ne pas consommer le quota gratuit Cloudinary sur des
// fichiers lourds.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import Btn from "../Btn";
import FormInput from "../FormInput";
import ImageUploadInput from "../ImageUploadInput";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

// Détermine l'URL de base selon le niveau de rattachement (le plus précis d'abord),
// même logique de priorité que mediaController.js côté back.
function getBasePath({ idArticle, idChapitre, idParagraphe }) {
    if (idParagraphe) {
        return `/api/articles/${idArticle}/chapitres/${idChapitre}/paragraphes/${idParagraphe}/medias`;
    }
    if (idChapitre) {
        return `/api/articles/${idArticle}/chapitres/${idChapitre}/medias`;
    }
    return `/api/articles/${idArticle}/medias`;
}

export default function MediaSection({ idArticle, idChapitre, idParagraphe }) {

    const basePath = getBasePath({ idArticle, idChapitre, idParagraphe });

    const [medias, setMedias] = useState([]);
    const [typeMedia, setTypeMedia] = useState("image");
    const [urlMedia, setUrlMedia] = useState("");
    const [legendeMedia, setLegendeMedia] = useState("");
    const [ordreMedia, setOrdreMedia] = useState("1");
    const [timecodeSecondesMedia, setTimecodeSecondesMedia] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [mediaToDelete, setMediaToDelete] = useState(null);

    const fetchMedias = () => {
        api.get(basePath)
            .then((response) => setMedias(response.data))
            .catch(() => toast.error("Impossible de charger les médias."));
    };

    useEffect(() => {
        fetchMedias();
    }, [basePath]);

    const resetForm = () => {
        setUrlMedia("");
        setLegendeMedia("");
        setOrdreMedia("1");
        setTimecodeSecondesMedia("");
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!urlMedia) {
            toast.error("Ajoute une image ou renseigne une URL avant de valider.");
            return;
        }

        setSubmitting(true);

        try {
            await api.post(basePath, {
                typeMedia,
                urlMedia,
                legendeMedia,
                ordreMedia: Number(ordreMedia),
                timecodeSecondesMedia: timecodeSecondesMedia ? Number(timecodeSecondesMedia) : null,
            });
            toast.success("Média ajouté.");
            resetForm();
            fetchMedias();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de l'ajout.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            // Suppression via l'id direct — la route DELETE /api/.../medias/:id fonctionne
            // quel que soit le niveau d'origine (l'id du média suffit, pas besoin du chemin complet).
            await api.delete(`${basePath}/${mediaToDelete.idMedia}`);
            setMediaToDelete(null);
            fetchMedias();
        } catch {
            toast.error("Impossible de supprimer ce média.");
        }
    };

    return (
        <div className="shadow-card p-4 flex flex-col gap-4">
            <h3 className="font-bold">Ajouter un média</h3>

            {/* Liste des médias existants */}
            <div className="flex flex-col gap-2">
                {medias.map((media) => (
                    <div key={media.idMedia} className="shadow-card p-3 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-bold">{media.legendeMedia || media.typeMedia}</p>
                            <Btn contenu="Supprimer" onClick={() => setMediaToDelete(media)} type="button" />
                        </div>

                        {media.typeMedia === "image" && (
                            <img src={media.urlMedia} alt={media.legendeMedia || ""} className="w-full max-h-40 object-cover" />
                        )}
                        {media.typeMedia === "video" && (
                            <p className="text-xs opacity-70 truncate">{media.urlMedia}</p>
                        )}
                        {media.typeMedia === "audio" && (
                            <p className="text-xs opacity-70 truncate">{media.urlMedia}</p>
                        )}

                        {media.timecodeSecondesMedia && (
                            <p className="text-xs opacity-70">Timecode : {media.timecodeSecondesMedia}s</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Formulaire d'ajout */}
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <label htmlFor={`typeMedia-${basePath}`}>Type</label>
                    <select
                        id={`typeMedia-${basePath}`}
                        value={typeMedia}
                        onChange={(e) => { setTypeMedia(e.target.value); setUrlMedia(""); }}
                        className="shadow-card p-3"
                    >
                        <option value="image">Image</option>
                        <option value="video">Vidéo (URL YouTube/Vimeo)</option>
                        <option value="audio">Audio (URL SoundCloud...)</option>
                    </select>
                </div>

                {typeMedia === "image" ? (
                    <ImageUploadInput
                        label="Image"
                        currentImageUrl={urlMedia}
                        onUploaded={(url) => setUrlMedia(url)}
                    />
                ) : (
                    <FormInput
                        label="URL"
                        id={`urlMedia-${basePath}`}
                        value={urlMedia}
                        onChange={(e) => setUrlMedia(e.target.value)}
                        placeholder="https://..."
                    />
                )}

                <FormInput
                    label="Légende"
                    id={`legendeMedia-${basePath}`}
                    value={legendeMedia}
                    onChange={(e) => setLegendeMedia(e.target.value)}
                    required={false}
                />

                <FormInput
                    label="Ordre"
                    id={`ordreMedia-${basePath}`}
                    type="number"
                    min="1"
                    value={ordreMedia}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || (Number(value) >= 1 && Number.isInteger(Number(value)))) {
                            setOrdreMedia(value);
                        }
                    }}
                    placeholder="1"
                />

                {(typeMedia === "video" || typeMedia === "audio") && (
                    <FormInput
                        label="Timecode de déclenchement (secondes, optionnel)"
                        id={`timecode-${basePath}`}
                        type="number"
                        value={timecodeSecondesMedia}
                        onChange={(e) => setTimecodeSecondesMedia(e.target.value)}
                        placeholder="45"
                        required={false}
                    />
                )}

                <Btn contenu={submitting ? "Ajout..." : "Ajouter le média"} type="submit" />
            </form>

            <ConfirmDeleteModal
                isOpen={mediaToDelete !== null}
                itemLabel={mediaToDelete?.legendeMedia || mediaToDelete?.typeMedia}
                onConfirm={handleDelete}
                onCancel={() => setMediaToDelete(null)}
            />
        </div>
    );
}