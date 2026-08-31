// Page publique listant les articles du blog.
// Les articles viennent de MySQL via l'API Sequelize (CRUD déjà en place côté back).
// Filtres indépendants (catégorie + tag) + tri par date de création, via listes déroulantes.

import { useEffect, useState } from "react";
import CardArticle from "../../components/CardArticle";
import api from "../../api/axiosConfig";

export default function ArticlesPage() {

    const [articles, setArticles] = useState([]);

    // "" = aucun filtre actif (toutes les catégories / tous les tags)
    const [filterCategorie, setFilterCategorie] = useState("");
    const [filterTag, setFilterTag] = useState("");
    const [sortOrder, setSortOrder] = useState("recent");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
    }, []);

    // Listes uniques de catégories et tags, calculées à partir des articles chargés
    const categories = [...new Map(
        articles.map((article) => [article.Categorie?.idCategorie, article.Categorie])
    ).values()].filter(Boolean);

    const tags = [...new Map(
        articles.flatMap((article) => article.Tags || []).map((tag) => [tag.idTag, tag])
    ).values()];

    // Filtrage : catégorie et tag sont deux critères indépendants,
    // un article doit satisfaire les deux (s'ils sont actifs) pour être affiché.
    // Les valeurs des <select> sont des strings, on compare donc en Number().
    let visibleArticles = articles;

    if (filterCategorie !== "") {
        visibleArticles = visibleArticles.filter((article) => {
            return article.Categorie?.idCategorie === Number(filterCategorie);
        });
    }

    if (filterTag !== "") {
        visibleArticles = visibleArticles.filter((article) => {
            return article.Tags?.some((tag) => tag.idTag === Number(filterTag));
        });
    }

    // Tri par date de création, appliqué après le filtrage
    visibleArticles = [...visibleArticles].sort((a, b) => {
        const dateA = new Date(a.dateCreationArticle);
        const dateB = new Date(b.dateCreationArticle);
        return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

    if (loading) {
        return <p className="text-center pt-15">Chargement...</p>;
    }

    if (error) {
        return <p className="text-center pt-15 text-red-600">{error}</p>;
    }

    return (
        <div className="flex flex-col items-center gap-8 p-6 pt-15">

            {/* Filtres et tri, chacun via une liste déroulante */}
            <div className="flex gap-6 flex-wrap justify-center">

                <div className="flex flex-col gap-2">
                    <label htmlFor="filtre-categorie"></label>
                    <select
                        id="filtre-categorie"
                        value={filterCategorie}
                        onChange={(e) => setFilterCategorie(e.target.value)}
                        className="shadow-card p-2"
                    >
                        <option value="" className="font-bold">Toutes catégories</option>
                        {categories.map((categorie) => (
                            <option key={categorie.idCategorie} value={categorie.idCategorie}>
                                {categorie.nomCategorie}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="filtre-tag"></label>
                    <select
                        id="filtre-tag"
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        className="shadow-card p-2"
                    >
                        <option value="" className="font-bold">Tous les tags</option>
                        {tags.map((tag) => (
                            <option key={tag.idTag} value={tag.idTag}>
                                {tag.nomTag}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="tri-date"></label>
                    <select
                        id="tri-date"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="shadow-card p-2"
                    >
                        <option value="recent">Plus récents</option>
                        <option value="ancien">Plus anciens</option>
                    </select>
                </div>

            </div>

            {/* Grille d'articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-40">
                {visibleArticles.map((article) => (
                    <CardArticle
                        key={article.idArticle}
                        idArticle={article.idArticle}
                        image={article.mediasArticle?.[0]?.urlMedia}
                        title={article.titreArticle}
                        comment={article.extraitArticle}
                        auteur={article.Auteur?.pseudo}
                        dureeLecture={article.dureeLectureArticle}
                        tags={article.Tags?.map((tag) => tag.nomTag).join(" - ")}
                        path={`/articles/${article.slugArticle}`}
                    />
                ))}
            </div>
        </div>
    );
}