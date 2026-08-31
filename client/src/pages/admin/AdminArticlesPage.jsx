// Page admin listant les articles du blog, avec actions Modifier/Supprimer.
// Même pattern que AdminProjectsPage.jsx (liste + ConfirmDeleteModal + fetch rappelable).

import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import Btn from "../../components/Btn";
import BackToDashboard from "../../components/BackToDashboard";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

export default function AdminArticlesPage() {

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Article ciblé par une suppression en attente de confirmation (null = aucune modale ouverte)
    const [articleToDelete, setArticleToDelete] = useState(null);

    // Extraite en fonction pour pouvoir la rappeler après une suppression réussie
    const fetchArticles = () => {
        api.get('/api/articles')
            .then((response) => {
                setArticles(response.data);
            })
            .catch(() => {
                setError("Impossible de charger les articles.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/articles/${articleToDelete.idArticle}`);
            setArticleToDelete(null);
            fetchArticles();
        } catch {
            setError("Impossible de supprimer cet article.");
        }
    };

    if (loading) {
        return <p className="text-center pt-15">Chargement...</p>;
    }

    if (error) {
        return <p className="text-center pt-15 text-red-600">{error}</p>;
    }

    return (
        <div className="flex flex-col gap-6 p-6 pt-15 max-w-3xl mx-auto">
            <BackToDashboard />

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Articles</h1>
                <Btn contenu="Nouvel article" path="/admin/articles/nouveau" />
            </div>

            <div className="flex flex-col gap-3">
                {articles.map((article) => (
                    <div key={article.idArticle} className="shadow-card p-4 flex justify-between items-center">
                        <div>
                            <p className="font-bold">{article.titreArticle}</p>
                            <p className="text-sm opacity-70">
                                {article.Categorie?.nomCategorie} · {article.statutArticle}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Btn contenu="Modifier" path={`/admin/articles/${article.idArticle}/modifier`} />
                            <Btn contenu="Supprimer" onClick={() => setArticleToDelete(article)} />
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmDeleteModal
                isOpen={articleToDelete !== null}
                itemLabel={articleToDelete?.titreArticle}
                onConfirm={handleDelete}
                onCancel={() => setArticleToDelete(null)}
            />
        </div>
    );
}