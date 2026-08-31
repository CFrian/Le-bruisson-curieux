// Formulaire d'ajout OU de modification d'un article, selon la présence d'un id dans l'URL.
// Route :id absent → création. Route :id présent → édition (pré-remplissage + PUT).
// Ne gère que les champs propres à l'article (métadonnées + catégorie + tags) —
// chapitres/paragraphes/médias/fiche info sont gérés séparément, comme des blocs indépendants.

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";
import FormInput from "../../components/FormInput";
import Btn from "../../components/Btn";

export default function ArticleFormPage() {
    // Si présent dans l'URL (/admin/articles/:id/modifier) → mode édition
    // Si absent (/admin/articles/nouveau) → mode création
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const navigate = useNavigate();

    const [titreArticle, setTitreArticle] = useState("");
    const [slugArticle, setSlugArticle] = useState("");
    const [extraitArticle, setExtraitArticle] = useState("");
    const [contenuIntroArticle, setContenuIntroArticle] = useState("");
    const [dureeLectureArticle, setDureeLectureArticle] = useState("");
    const [statutArticle, setStatutArticle] = useState("brouillon");
    const [motDeLaFinArticle, setMotDeLaFinArticle] = useState("");
    const [idCategorie, setIdCategorie] = useState("");
    const [idAuteur, setIdAuteur] = useState("");
    const [selectedTagIds, setSelectedTagIds] = useState([]);

    const [categories, setCategories] = useState([]);
    const [auteurs, setAuteurs] = useState([]);
    const [tags, setTags] = useState([]);

    const [loading, setLoading] = useState(false);

    // Chargement des listes pour les select/checkbox (catégories, auteurs, tags),
    // dans tous les cas (création ET édition)
    useEffect(() => {
        api.get('/api/categories').then((res) => setCategories(res.data));
        api.get('/api/tags').then((res) => setTags(res.data));
        api.get('/api/auteurs').then((res) => setAuteurs(res.data));
    }, []);

    // En mode édition, on charge les données existantes de l'article pour pré-remplir le formulaire
    useEffect(() => {
        if (!isEditMode) return; // rien à charger en mode création

        api.get(`/api/articles/${id}`)
            .then((response) => {
                const article = response.data;
                setTitreArticle(article.titreArticle);
                setSlugArticle(article.slugArticle);
                setExtraitArticle(article.extraitArticle);
                setContenuIntroArticle(article.contenuIntroArticle || "");
                setDureeLectureArticle(article.dureeLectureArticle);
                setStatutArticle(article.statutArticle);
                setMotDeLaFinArticle(article.motDeLaFinArticle || "");
                setIdCategorie(article.Categorie?.idCategorie || "");
                setIdAuteur(article.Auteur?.idAuteur || "");
                setSelectedTagIds(article.Tags?.map((tag) => tag.idTag) || []);
            })
            .catch(() => {
                toast.error("Impossible de charger l'article.");
            });
    }, [id, isEditMode]);

    // Coche/décoche un tag dans la sélection multiple
    const toggleTag = (tagId) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId)
                ? prev.filter((t) => t !== tagId)
                : [...prev, tagId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const articleData = {
            titreArticle,
            slugArticle,
            extraitArticle,
            contenuIntroArticle,
            dureeLectureArticle: Number(dureeLectureArticle),
            statutArticle,
            motDeLaFinArticle,
            idCategorie: Number(idCategorie),
            idAuteur: Number(idAuteur),
            dateCreationArticle: new Date().toISOString(),
            dateMajArticle: new Date().toISOString(),
        };

        try {
            let articleId = id;

            if (isEditMode) {
                await api.put(`/api/articles/${id}`, articleData);
                toast.success("Article modifié avec succès.");
            } else {
                const response = await api.post('/api/articles', articleData);
                articleId = response.data.idArticle;
                toast.success("Article créé avec succès.");
            }

            // Synchronisation des tags — décision simple : on remplace tout à chaque sauvegarde
            // plutôt que de calculer un diff précis (ajouts/retraits), pas critique en volume ici.
            // (nécessite un endpoint de synchronisation, à ajouter côté back si pas déjà prévu)
            await api.put(`/api/articles/${articleId}/tags`, { tagIds: selectedTagIds });

            navigate('/admin/articles');
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 p-6 pt-15">

            <div className="w-full max-w-md">
                <Link to="/admin/articles" className="hover:opacity-70 transition-opacity duration-200">
                    ← Retour à la liste des articles
                </Link>
            </div>

            <h1 className="text-2xl font-bold">
                {isEditMode ? "Modifier l'article" : "Ajouter un article"}
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-md p-5 shadow-2xl gap-5 flex flex-col">

                <FormInput
                    label="Titre"
                    id="titreArticle"
                    value={titreArticle}
                    onChange={(e) => setTitreArticle(e.target.value)}
                    placeholder="Titre de l'article"
                />
                <FormInput
                    label="Slug"
                    id="slugArticle"
                    value={slugArticle}
                    onChange={(e) => setSlugArticle(e.target.value)}
                    placeholder="titre-de-l-article"
                />
                <FormInput
                    label="Extrait"
                    id="extraitArticle"
                    as="textarea"
                    value={extraitArticle}
                    onChange={(e) => setExtraitArticle(e.target.value)}
                    placeholder="Court résumé affiché sur la card"
                />
                <FormInput
                    label="Introduction"
                    id="contenuIntroArticle"
                    as="textarea"
                    value={contenuIntroArticle}
                    onChange={(e) => setContenuIntroArticle(e.target.value)}
                    placeholder="Introduction affichée en haut de l'article"
                    required={false}
                />
                <FormInput
                    label="Durée de lecture (minutes)"
                    id="dureeLectureArticle"
                    type="number"
                    value={dureeLectureArticle}
                    onChange={(e) => setDureeLectureArticle(e.target.value)}
                    placeholder="8"
                />

                <div className="flex flex-col gap-2">
                    <label htmlFor="statutArticle">Statut</label>
                    <select
                        id="statutArticle"
                        value={statutArticle}
                        onChange={(e) => setStatutArticle(e.target.value)}
                        className="shadow-card p-3"
                    >
                        <option value="brouillon">Brouillon</option>
                        <option value="publié">Publié</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="idCategorie">Catégorie</label>
                    <select
                        id="idCategorie"
                        value={idCategorie}
                        onChange={(e) => setIdCategorie(e.target.value)}
                        required
                        className="shadow-card p-3"
                    >
                        <option value="">-- Choisir une catégorie --</option>
                        {categories.map((categorie) => (
                            <option key={categorie.idCategorie} value={categorie.idCategorie}>
                                {categorie.nomCategorie}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="idAuteur">Auteur</label>
                    <select
                        id="idAuteur"
                        value={idAuteur}
                        onChange={(e) => setIdAuteur(e.target.value)}
                        required
                        className="shadow-card p-3"
                    >
                        <option value="">-- Choisir un auteur --</option>
                        {auteurs.map((auteur) => (
                            <option key={auteur.idAuteur} value={auteur.idAuteur}>
                                {auteur.pseudo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <p>Tags</p>
                    <div className="flex flex-wrap gap-3">
                        {tags.map((tag) => (
                            <label key={tag.idTag} className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={selectedTagIds.includes(tag.idTag)}
                                    onChange={() => toggleTag(tag.idTag)}
                                />
                                {tag.nomTag}
                            </label>
                        ))}
                    </div>
                </div>

                <FormInput
                    label="Mot de la fin"
                    id="motDeLaFinArticle"
                    as="textarea"
                    value={motDeLaFinArticle}
                    onChange={(e) => setMotDeLaFinArticle(e.target.value)}
                    placeholder="Conclusion de l'article"
                    required={false}
                />

                <Btn
                    contenu={loading ? "Enregistrement..." : isEditMode ? "Enregistrer les modifications" : "Créer l'article"}
                    type="submit"
                />
            </form>
        </div>
    );
}