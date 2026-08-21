// Champ d'upload d'image réutilisable.
// Au choix d'un fichier, l'upload se déclenche automatiquement vers /api/upload.
// Une fois terminé, l'URL Cloudinary reçue est transmise au parent via onUploaded,
// pour qu'il l'utilise dans son propre state (ex: le champ "image" d'un projet).

import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";

export default function ImageUploadInput({ label, currentImageUrl, onUploaded }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // FormData : format spécial requis pour envoyer un fichier binaire
        // dans une requête HTTP (contrairement au JSON classique).
        const formData = new FormData();
        formData.append('image', file); // "image" doit correspondre à upload.single('image') côté back

        setUploading(true);

        try {
            const response = await api.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onUploaded(response.data.url);
            toast.success("Image envoyée avec succès.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de l'envoi de l'image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <span>{label}</span>

            {currentImageUrl && (
                <img src={currentImageUrl} alt="Aperçu" className="w-32 h-32 object-cover" />
            )}

            {/* Input natif caché — jamais affiché directement à l'utilisateur */}
            <input
                id="image-upload"
                type="file"
                accept="image/jpeg, image/png, image/webp, image/svg+xml"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
            />

            {/* Label stylisé comme un bouton, déclenche l'input caché au clic
                grâce au htmlFor correspondant à l'id de l'input */}
            <label
                htmlFor="image-upload"
                className={`shadow-cta hover:shadow-card transition-shadow duration-200 p-3 w-fit cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                {uploading
                    ? 'Envoi en cours...'
                    : currentImageUrl
                        ? "Changer l'image"
                        : "Choisir une image"}
            </label>
        </div>
    );
}