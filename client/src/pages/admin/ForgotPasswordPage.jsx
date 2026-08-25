// Page où l'utilisateur saisit son email pour recevoir un lien de réinitialisation.
// Route publique, accessible depuis LoginPage.

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import FormInput from "../../components/FormInput";
import Btn from "../../components/Btn";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/api/auth/forgot-password', { email });
            // Le back renvoie toujours ce même message, que l'email existe ou non
            // (évite l'énumération de comptes) — donc pas de branche succès/erreur ici,
            // on affiche systématiquement la confirmation.
            setSubmitted(true);
        } catch (err) {
            toast.error("Une erreur est survenue, réessaie plus tard.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center pt-30 gap-5 text-center">
                <h1 className="text-2xl">Vérifie ta boîte mail</h1>
                <p className="max-w-md">
                    Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.
                    Le lien est valable 15 minutes.
                </p>
                <Link to="/admin/login" className="hover:opacity-70 transition-opacity duration-200">
                    ← Retour à la connexion
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full justify-center items-center pb-40 pt-30 gap-7">
            <h1 className="text-2xl">Mot de passe oublié</h1>
            <p className="text-center max-w-md">
                Saisis ton email, tu recevras un lien pour définir un nouveau mot de passe.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-md p-5 shadow-2xl gap-5 flex flex-col">
                <FormInput
                    label="Email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton-email@exemple.com"
                />
                <Btn contenu={loading ? "Envoi..." : "Envoyer le lien"} type="submit" />
            </form>

            <Link to="/admin/login" className="hover:opacity-70 transition-opacity duration-200">
                ← Retour à la connexion
            </Link>
        </div>
    );
}