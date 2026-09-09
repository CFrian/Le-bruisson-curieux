// Section de gestion des médias : liste, ajout, suppression.
// Réutilisable à 3 niveaux (article / chapitre / paragraphe) selon les props reçues.
//
// Type "image" → sélection différée via ImageUploadInput (onFileSelected) : le fichier
// est stocké en mémoire avec aperçu local, l'upload Cloudinary réel ne se déclenche
// qu'au clic sur "Ajouter le média" — jamais avant, pour éviter tout fichier orphelin
// si l'utilisateur change d'avis ou annule.
// Type "video"/"audio" → simple champ URL (YouTube/Vimeo/SoundCloud...).
//
// Pas de <form> ici : imbriqué dans le <form> principal d'ArticleFormPage, HTML interdit
// un <form> dans un <form>. Boutons en type="button" avec onClick.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import Btn from "../Btn";
import FormInput from "../FormInput";
import ImageUploadInput from "../ImageUploadInput";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

function getBasePath({ idArticle, idChapitre, idParagraphe }) {
    if (idParagraphe) {
        return `/api/articles/${idArticle}/chapitres/${idChapitre}/paragraphes/${idParagraphe}/medias`;
    }
    if (idChapitre) {
        return `/api/articles/${idArticle}/chapitres/${idChapitre}/medias`;
    }
    return `/api/articles/${idArticle}/medias`;
}

export default function MediaSection({ idArticle, idChapitre, idParagraphe, allowedTypes = ["image", "video", "audio"] }) {

    const basePath = getBasePath({ idArticle, idChapitre, idParagraphe });

    const [medias, setMedias] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [typeMedia, setTypeMedia] = useState("image");
    const [selectedFile, setSelectedFile] = useState(null);
    const [urlMedia, setUrlMedia] = useState(""); // utilisé uniquement pour video/audio
    const [legendeMedia, setLegendeMedia] = useState("");
    const [ordreMedia, setOrdreMedia] = useState("1");
    const [timecodeSecondesMedia, setTimecodeSecondesMedia] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [mediaToDelete, setMediaToDelete] = useState(null);

    const fetchMedias = () => {
        api.get(basePath)
            .then((response) => {
                const filtered = response.data.filter((m) => allowedTypes.includes(m.typeMedia));
                setMedias(filtered);
            })
            .catch(() => toast.error("Impossible de charger les médias."));
    };

    useEffect(() => {
        if (!idArticle) return; // ne rien charger tant que l'article n'existe pas
        fetchMedias();
    }, [basePath, idArticle]);

    const resetForm = () => {
        setSelectedFile(null);
        setUrlMedia("");
        setLegendeMedia("");
        setOrdreMedia("1");
        setTimecodeSecondesMedia("");
    };

    const handleAdd = async () => {
        if (typeMedia === "image" && !selectedFile) {
            toast.error("Choisis une image avant de valider.");
            return;
        }
        if (typeMedia !== "image" && !urlMedia) {
            toast.error("Renseigne une URL avant de valider.");
            return;
        }

        setSubmitting(true);

        try {
            let finalUrl = urlMedia;
            let finalPublicId = null;

            // Upload Cloudinary réel, seulement maintenant, seulement si type image
            if (typeMedia === "image" && selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);

                const uploadResponse = await api.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalUrl = uploadResponse.data.url;
                finalPublicId = uploadResponse.data.publicId;
            }

            await api.post(basePath, {
                typeMedia,
                urlMedia: finalUrl,
                publicIdMedia: finalPublicId,
                legendeMedia,
                ordreMedia: Number(ordreMedia),
                timecodeSecondesMedia: timecodeSecondesMedia ? Number(timecodeSecondesMedia) : null,
            });

            toast.success("Média ajouté.");
            resetForm();
            setShowForm(false);
            fetchMedias();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de l'ajout.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`${basePath}/${mediaToDelete.idMedia}`);
            setMediaToDelete(null);
            fetchMedias();
        } catch {
            toast.error("Impossible de supprimer ce média.");
        }
    };

    return (
        <div className="shadow-card p-4 flex flex-col gap-4">
            <h3 className="font-bold">Médias</h3>

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
                        {(media.typeMedia === "video" || media.typeMedia === "audio") && (
                            <p className="text-xs opacity-70 truncate">{media.urlMedia}</p>
                        )}
                        {media.timecodeSecondesMedia && (
                            <p className="text-xs opacity-70">Timecode : {media.timecodeSecondesMedia}s</p>
                        )}
                    </div>
                ))}
            </div>

            {!showForm ? (
                <Btn contenu="+ Ajouter un média" onClick={() => setShowForm(true)} type="button" />
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <label htmlFor={`typeMedia-${basePath}`}>Type</label>
                        <select
                            id={`typeMedia-${basePath}`}
                            value={typeMedia}
                            onChange={(e) => { setTypeMedia(e.target.value); resetForm(); }}
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
                            currentImageUrl={null}
                            onFileSelected={(file) => setSelectedFile(file)}
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

                    <div className="flex gap-3">
                        <Btn contenu={submitting ? "Ajout..." : "Ajouter le média"} type="button" onClick={handleAdd} />
                        <Btn contenu="Annuler" onClick={() => setShowForm(false)} type="button" />
                    </div>
                </div>
            )}

            <ConfirmDeleteModal
                isOpen={mediaToDelete !== null}
                itemLabel={mediaToDelete?.legendeMedia || mediaToDelete?.typeMedia}
                onConfirm={handleDelete}
                onCancel={() => setMediaToDelete(null)}
            />
        </div>
    );
}