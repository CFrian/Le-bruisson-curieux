// Page accessible via le lien reçu par email (?token=...).
// Permet de définir un nouveau mot de passe sans connaître l'ancien.

import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import FormInput from "../../components/FormInput";
import Btn from "../../components/Btn";

export default function ResetPasswordPage() {
    // useSearchParams lit les paramètres de l'URL (?token=abc123)
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/api/auth/reset-password', { token, newPassword });
            toast.success("Mot de passe réinitialisé avec succès. Connecte-toi avec ton nouveau mot de passe.");
            navigate('/admin/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Lien invalide ou expiré.");
        } finally {
            setLoading(false);
        }
    };

    // Si l'URL n'a pas de token (accès direct à la page sans passer par l'email),
    // on informe plutôt que de laisser un formulaire qui échouera silencieusement.
    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center pt-30 gap-5 text-center">
                <h1 className="text-2xl">Lien invalide</h1>
                <p>Ce lien de réinitialisation est incomplet ou invalide.</p>
                <Link to="/admin/forgot-password" className="hover:opacity-70 transition-opacity duration-200">
                    Demander un nouveau lien
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full justify-center items-center pb-40 pt-30 gap-7">
            <h1 className="text-2xl">Nouveau mot de passe</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-md p-5 shadow-2xl gap-5 flex flex-col">
                <FormInput
                    label="Nouveau mot de passe"
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="8 caractères min., majuscule, minuscule, chiffre, spécial"
                />
                <Btn contenu={loading ? "Validation..." : "Réinitialiser le mot de passe"} type="submit" />
            </form>
        </div>
    );
}