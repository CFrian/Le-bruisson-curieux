// Page publique affichant le détail complet d'un article : titre, méta (favori/durée/tag/
// auteur/date), image de couverture, fiche info, introduction, média principal (vidéo/audio),
// chapitres (avec leurs médias et paragraphes, chacun avec ses propres médias), mot de la fin.
// L'article est identifié par son slug (URL lisible), pas par son id technique.

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import { getVideoEmbed } from "../../utils/videoEmbed";

// Affiche un média selon son type : image classique, audio natif, ou vidéo —
// intégration YouTube/Vimeo via iframe si l'URL est reconnue, sinon <video> classique
// en dernier recours (fichier vidéo direct).
function MediaDisplay({ media }) {
    if (media.typeMedia === 'image') {
        return <img src={media.urlMedia} alt={media.legendeMedia || ''} className="w-full" />;
    }

    if (media.typeMedia === 'audio') {
        return <audio src={media.urlMedia} controls className="w-full" />;
    }

    const embed = getVideoEmbed(media.urlMedia);

    if (embed) {
        return (
            <div className="aspect-video w-full">
                <iframe
                    src={embed.embedUrl}
                    title={media.legendeMedia || 'Vidéo'}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    return <video src={media.urlMedia} controls className="w-full" />;
}

export default function ArticleSinglePage() {
    const { slug } = useParams();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavori, setIsFavori] = useState(false);

    useEffect(() => {
        api.get(`/api/articles/slug/${slug}`)
            .then((response) => {
                setArticle(response.data);
            })
            .catch(() => {
                setError("Impossible de charger cet article.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [slug]);

    // Favori stocké en localStorage — pas de compte requis, cohérent avec la décision
    // actée pour le blog. Dépend du chargement de l'article (idArticle), d'où un
    // useEffect séparé plutôt qu'un état initial calculé directement.
    useEffect(() => {
        if (!article) return;
        const favoris = JSON.parse(localStorage.getItem('articlesFavoris') || '[]');
        setIsFavori(favoris.includes(article.idArticle));
    }, [article]);

    const toggleFavori = () => {
        const favoris = JSON.parse(localStorage.getItem('articlesFavoris') || '[]');
        const updated = isFavori
            ? favoris.filter((id) => id !== article.idArticle)
            : [...favoris, article.idArticle];
        localStorage.setItem('articlesFavoris', JSON.stringify(updated));
        setIsFavori(!isFavori);
    };

    if (loading) {
        return <p className="text-center pt-15">Chargement...</p>;
    }

    if (error) {
        return <p className="text-center pt-15 text-red-600">{error}</p>;
    }

    if (!article) {
        return <p className="text-center pt-15">Article introuvable.</p>;
    }

    return (
        <article className="flex flex-col gap-8 p-6 max-w-3xl mx-auto pt-15">

            {/* Titre — même style visuel que Btn.jsx */}
            <h1 className="text-3xl font-bold text-center shadow-cta p-3 w-fit mx-auto">
                {article.titreArticle}
            </h1>

            {/* Bloc méta — chaque item dans sa propre boîte, même style que Btn.jsx */}
            <div className="flex flex-wrap justify-center gap-3">
                <button onClick={toggleFavori} className="shadow-cta hover:shadow-card transition-shadow duration-200 p-3 cursor-pointer">
                    {isFavori ? "★ Retirer des favoris" : "☆ Ajouter aux favoris"}
                </button>
                <span className="shadow-cta p-3">
                    {article.dureeLectureArticle} min
                </span>
                {article.Tags?.[0] && (
                    <span className="shadow-cta p-3">
                        #{article.Tags[0].nomTag}
                    </span>
                )}
                <span className="shadow-cta p-3">
                    {article.Auteur?.pseudo}
                </span>
                <span className="shadow-cta p-3">
                    {new Date(article.dateCreationArticle).toLocaleDateString('fr-FR')}
                </span>
            </div>

            {/* Image de couverture — médias niveau article, uniquement le type image */}
            {article.mediasArticle
                ?.filter((media) => media.typeMedia === 'image')
                .map((media) => (
                    <MediaDisplay key={media.idMedia} media={media} />
                ))}

            {/* Fiche info technique (clé/valeur, ex: Studio, Sortie, Musique...) */}
            {article.FicheInfos?.length > 0 && (
                <aside className="border-l-2 border-r-2 border-gray-400 px-8 py-4 flex flex-col gap-1 italic mx-auto max-w-md">
                    {article.FicheInfos.map((fiche) => (
                        <p key={fiche.idFicheInfo}>
                            {fiche.cleFicheInfo} : {fiche.valeurFicheInfo}
                        </p>
                    ))}
                </aside>
            )}

            {/* Introduction */}
            {article.contenuIntroArticle && (
                <p className="italic">{article.contenuIntroArticle}</p>
            )}

            {/* Média principal — vidéo/audio niveau article, sur lequel l'analyse s'appuie */}
            {article.mediasArticle
                ?.filter((media) => media.typeMedia === 'video' || media.typeMedia === 'audio')
                .map((media) => (
                    <MediaDisplay key={media.idMedia} media={media} />
                ))}

            {/* Chapitres, chacun avec ses médias propres et ses paragraphes */}
            {article.Chapitres?.map((chapitre) => (
                <section key={chapitre.idChapitre} className="flex flex-col gap-4">
                    {chapitre.titreChap && (
                        <h2 className="text-2xl font-bold">{chapitre.titreChap}</h2>
                    )}

                    {chapitre.mediasChapitre?.map((media) => (
                        <MediaDisplay key={media.idMedia} media={media} />
                    ))}

                    {chapitre.Paragraphes?.map((paragraphe) => (
                        <div key={paragraphe.idParagraphe} className="flex flex-col gap-2">
                            {paragraphe.titreParagraphe && (
                                <h3 className="text-xl font-bold">{paragraphe.titreParagraphe}</h3>
                            )}
                            <p>{paragraphe.contenuParagraphe}</p>

                            {paragraphe.mediasParagraphe?.map((media) => (
                                <MediaDisplay key={media.idMedia} media={media} />
                            ))}
                        </div>
                    ))}
                </section>
            ))}

            {/* Mot de la fin */}
            {article.motDeLaFinArticle && (
                <div className="border-l-2 border-gray-400 pl-6 py-2 italic max-w-2xl mx-auto">
                    <p className="font-bold not-italic mb-1">Le mot de la fin :</p>
                    <p>{article.motDeLaFinArticle}</p>
                </div>
            )}
        </article>
    );
}