// Page "Mon compte" — permet de changer l'email et le mot de passe à volonté,
// contrairement à ChangePasswordPage qui ne sert qu'au flux de premier login forcé.

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import FormInput from "../../components/FormInput";
import Btn from "../../components/Btn";

export default function AccountSettingsPage() {
    // --- Formulaire email ---
    const [newEmail, setNewEmail] = useState("");
    const [passwordForEmail, setPasswordForEmail] = useState("");
    const [savingEmail, setSavingEmail] = useState(false);

    // --- Formulaire mot de passe ---
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setSavingEmail(true);

        try {
            await api.patch('/api/auth/email', {
                newEmail,
                currentPassword: passwordForEmail
            });
            toast.success("Email modifié avec succès.");
            setNewEmail("");
            setPasswordForEmail("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la modification de l'email.");
        } finally {
            setSavingEmail(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSavingPassword(true);

        try {
            await api.post('/api/auth/change-password', {
                oldPassword,
                newPassword
            });
            toast.success("Mot de passe modifié avec succès.");
            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la modification du mot de passe.");
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 p-6 pt-15">

            <div className="w-full max-w-md">
                <Link to="/admin/dashboard" className="hover:opacity-70 transition-opacity duration-200">
                    ← Retour au tableau de bord
                </Link>
            </div>

            <h1 className="text-2xl font-bold">Mon compte</h1>

            {/* Formulaire email — séparé du mot de passe : chaque action a sa propre
                confirmation par mot de passe actuel, sa propre soumission indépendante. */}
            <form onSubmit={handleEmailSubmit} className="w-full max-w-md p-5 shadow-2xl gap-5 flex flex-col">
                <h2 className="text-xl font-bold">Changer l'email</h2>
                <FormInput
                    label="Nouvel email"
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nouvel-email@exemple.com"
                />
                <FormInput
                    label="Mot de passe actuel"
                    id="passwordForEmail"
                    type="password"
                    value={passwordForEmail}
                    onChange={(e) => setPasswordForEmail(e.target.value)}
                    placeholder="Confirme avec ton mot de passe"
                />
                <Btn
                    contenu={savingEmail ? "Modification..." : "Changer l'email"}
                    type="submit"
                />
            </form>

            {/* Formulaire mot de passe */}
            <form onSubmit={handlePasswordSubmit} className="w-full max-w-md p-5 shadow-2xl gap-5 flex flex-col">
                <h2 className="text-xl font-bold">Changer le mot de passe</h2>
                <FormInput
                    label="Ancien mot de passe"
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Mot de passe actuel"
                />
                <FormInput
                    label="Nouveau mot de passe"
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe (8 caractères min.)"
                />
                <Btn
                    contenu={savingPassword ? "Modification..." : "Changer le mot de passe"}
                    type="submit"
                />
            </form>
        </div>
    );
}