// EmailButton.jsx
import { useState } from "react";
import { toast } from "react-toastify";

export default function EmailButton() {
    // Email jamais injecté dans le DOM — reste en mémoire JS uniquement,
    // copié directement dans le presse-papier au clic.
    // Protection légère anti-scraping + contourne les soucis de client mail par défaut (mailto: non fiable).
    const reversedEmail = 'moc.liamnotorp@setsoC-nairolF';
    const email = reversedEmail.split('').reverse().join('');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            toast.success('Email copié dans le presse-papier !');
        } catch (err) {
            // navigator.clipboard peut échouer (permissions navigateur, contexte non sécurisé http)
            toast.error("Impossible de copier l'email, réessaie.");
        }
    };

    return (
        <button
            onClick={handleCopy}
            aria-label="Copier mon adresse email"
            className='p-1 rounded-xl cursor-pointer hover:shadow-card duration-200'
        >
            <img src="/icon-mail.svg" alt="" className='w-12 h-12' />
        </button>
    );
}