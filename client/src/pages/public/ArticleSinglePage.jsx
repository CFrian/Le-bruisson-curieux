// Page publique affichant le détail complet d'un article : métadonnées,
// chapitres/paragraphes, médias à leurs différents niveaux, fiche info, mot de la fin.
// L'article est identifié par son slug (URL lisible), pas par son id technique.

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function ArticlePage() {

    const { slug } = useParams();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold">{article.titreArticle}</h1>
                <p className="text-sm opacity-70">
                    {article.Auteur?.pseudo} · {article.Categorie?.nomCategorie} · {article.dureeLectureArticle} min
                </p>
                <div className="flex gap-2">
                    {article.Tags?.map((tag) => (
                        <span key={tag.idTag} className="text-xs shadow-card px-2 py-1">{tag.nomTag}</span>
                    ))}
                </div>
            </header>

            {article.contenuIntroArticle && (
                <p className="italic">{article.contenuIntroArticle}</p>
            )}

            {/* Médias niveau article (galerie/vidéo/audio non rattachés à un chapitre précis) */}
            {article.mediasArticle?.map((media) => (
                <div key={media.idMedia}>
                    {media.typeMedia === 'image' && (
                        <img src={media.urlMedia} alt={media.legendeMedia || ''} className="w-full" />
                    )}
                    {media.typeMedia === 'video' && (
                        <video src={media.urlMedia} controls className="w-full" />
                    )}
                    {media.typeMedia === 'audio' && (
                        <audio src={media.urlMedia} controls className="w-full" />
                    )}
                </div>
            ))}

            {/* Chapitres, chacun avec ses paragraphes et ses médias propres */}
            {article.Chapitres?.map((chapitre) => (
                <section key={chapitre.idChapitre} className="flex flex-col gap-4">
                    {chapitre.titreChap && (
                        <h2 className="text-2xl font-bold">{chapitre.titreChap}</h2>
                    )}

                    {chapitre.mediasChapitre?.map((media) => (
                        <div key={media.idMedia}>
                            {media.typeMedia === 'image' && (
                                <img src={media.urlMedia} alt={media.legendeMedia || ''} className="w-full" />
                            )}
                            {media.typeMedia === 'video' && (
                                <video src={media.urlMedia} controls className="w-full" />
                            )}
                            {media.typeMedia === 'audio' && (
                                <audio src={media.urlMedia} controls className="w-full" />
                            )}
                        </div>
                    ))}

                    {chapitre.Paragraphes?.map((paragraphe) => (
                        <p key={paragraphe.idParagraphe}>{paragraphe.contenuParagraphe}</p>
                    ))}
                </section>
            ))}

            {/* Fiche info technique (clé/valeur, ex: Studio, Sortie, Musique...) */}
            {article.FicheInfos?.length > 0 && (
                <aside className="shadow-card p-4 flex flex-col gap-1">
                    {article.FicheInfos.map((fiche) => (
                        <p key={fiche.idFicheInfo}>
                            <strong>{fiche.cleFicheInfo} :</strong> {fiche.valeurFicheInfo}
                        </p>
                    ))}
                </aside>
            )}

            {article.motDeLaFinArticle && (
                <footer className="italic border-t pt-4">{article.motDeLaFinArticle}</footer>
            )}
        </article>
    );
}