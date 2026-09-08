// Champ de sélection d'image réutilisable.
// Ne fait AUCUN upload au choix du fichier — stocke seulement le fichier en mémoire
// avec un aperçu local, et notifie le parent via onFileSelected.
// C'est au parent de déclencher l'upload réel (POST /api/upload) au moment de sa
// propre soumission de formulaire — jamais avant, pour éviter tout fichier orphelin
// sur Cloudinary si l'utilisateur change d'avis ou annule.

import { useState, useEffect } from "react";

export default function ImageUploadInput({ label, currentImageUrl, onFileSelected }) {
    const [previewUrl, setPreviewUrl] = useState(currentImageUrl || null);

    // Si le parent change currentImageUrl de l'extérieur (ex: chargement d'un projet
    // existant en mode édition), on met à jour l'aperçu en conséquence.
    useEffect(() => {
        setPreviewUrl(currentImageUrl || null);
    }, [currentImageUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);
        onFileSelected(file); // transmet le fichier brut au parent, pas encore uploadé
    };

    return (
        <div className="flex flex-col gap-2">
            <span>{label}</span>

            {previewUrl && (
                <img src={previewUrl} alt="Aperçu" className="w-32 h-32 object-cover" />
            )}

            <input
                id={`image-upload-${label}`}
                type="file"
                accept="image/jpeg, image/png, image/webp, image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
            />

            <label
                htmlFor={`image-upload-${label}`}
                className="shadow-cta hover:shadow-card transition-shadow duration-200 p-3 w-fit cursor-pointer"
            >
                {previewUrl ? "Changer l'image" : "Choisir une image"}
            </label>
        </div>
    );
}