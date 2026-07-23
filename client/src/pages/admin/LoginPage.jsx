// Page de connexion admin.
// Envoie email + password au back via axios.
// En cas de succès, met à jour le contexte auth et redirige vers le dashboard.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/FormInput';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            login(data.mustChangePassword);
            toast.success(data.message);

            if (data.mustChangePassword) {
                navigate('/admin/change-password');
            } else {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full justify-center items-center pb-40 pt-30 gap-7">
            <h1 className="text-2xl">Connexion Admin</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md p-5 shadow-2xl gap-5 flex flex-col">
                <FormInput label="Email" id="email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder="Ajouter email" />
                <FormInput label="Mot de passe" id="password" type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="Ajouter mot de passe" />
                <button
                    type="submit"
                    disabled={loading}
                    className="shadow-cta hover:shadow-card active:scale-95 transition-all duration-150 p-3 w-full sm:w-50 font-semibold disabled:opacity-50"                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
}