// ChangePasswordPage.jsx
// Page de changement de mot de passe obligatoire — affichée après une première connexion
// avec un mot de passe temporaire (mustChangePassword: true côté back).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/FormInput';

export default function ChangePasswordPage() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); // à ajuster selon ce que ton contexte expose réellement

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post('/api/auth/change-password', {
                oldPassword,
                newPassword
            });

            toast.success(data.message || "Mot de passe modifié avec succès.");

            // Le flag mustChangePassword est maintenant à false côté back —
            // on redirige vers le dashboard, plus besoin de repasser par ce formulaire
            navigate('/admin/dashboard');

        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors du changement de mot de passe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full justify-center items-center pb-40 pt-30 gap-7">
            <h1 className="text-2xl">Changement de mot de passe</h1>
            <p className="text-center max-w-md">
                Pour des raisons de sécurité, vous devez définir un nouveau mot de passe avant de continuer.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-md p-5 shadow-2xl gap-5 flex flex-col">
                <FormInput
                    label="Ancien mot de passe"
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Mot de passe temporaire reçu par email"
                />
                <FormInput
                    label="Nouveau mot de passe"
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe (8 caractères min.)"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="shadow-cta hover:shadow-card transition-shadow duration-200 p-3 w-full sm:w-50 font-semibold disabled:opacity-50"
                >
                    {loading ? 'Modification...' : 'Valider le nouveau mot de passe'}
                </button>
            </form>
        </div>
    );
}