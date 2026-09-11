// Page d'accueil du Blog — point d'entrée du site (redirection depuis "/").
// Hero isolé (image de fond, inchangé). Reste du contenu en flex-col centré,
// espacement géré par un seul gap global plutôt que des marges dispersées.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardArticle from "../../components/CardArticle";
import api from "../../api/axiosConfig";
import heroImage from "../../assets/images/accueil_hero.jpg";
import PanelBorderLR from "../../components/PanelBorderLR";

export default function AccueilPage() {

    const [derniersArticles, setDerniersArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/articles')
            .then((response) => {
                setDerniersArticles(response.data.slice(0, 3));
            })
            .catch(() => { })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <div
                className="bg-black text-white flex flex-col justify-center items-center min-height: 500px px-6"
                style={{
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <h1 className="text-5xl font-bold mb-6">Le son</h1>
                <div className="flex flex-col items-center text-3xl gap-2 text-center">
                    <p>se ressent.</p>
                    <p>demande de l'attention.</p>
                    <p>me porte.</p>
                    <p>m'apaise.</p>
                    <p>m'interroge.</p>
                    <p>oriente mon regard.</p>
                    <p>crée une atmosphère...</p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-10 p-6 mt-7">
                <PanelBorderLR>
                    <p>
                        Le son, c'est le premier sens qui s'allume. Avant les images, avant les mots.
                    </p>
                    <br />
                    <p>
                        Ici, je décortique ce qui fait qu'une bande-son nous happe,<br />
                        pourquoi cette musique nous fait frissonner,<br />
                        comment un bruitage se crée ou change un film.
                    </p>
                </PanelBorderLR>

                <div className="flex flex-col items-center gap-1 shadow-cta p-6 w-fit">
                    <h2 className="text-3xl font-bold">Les articles</h2>
                    <p className="opacity-70">Films, séries, jeux vidéo</p>
                </div>

                {!loading && (
                    <div className="flex flex-row flex-wrap justify-center gap-5">
                        {derniersArticles.map((article) => (
                            <CardArticle
                                key={article.idArticle}
                                idArticle={article.idArticle}
                                image={article.mediasArticle?.[0]?.urlMedia}
                                title={article.titreArticle}
                                comment={article.extraitArticle}
                                auteur={article.Auteur?.pseudo}
                                dureeLecture={article.dureeLectureArticle}
                                tags={article.Tags?.map((tag) => tag.nomTag).join(" - ")}
                                date={new Date(article.dateCreationArticle).toLocaleDateString('fr-FR')}
                                path={`/articles/${article.slugArticle}`}
                            />
                        ))}
                    </div>
                )}

                <Link to="/articles" className="shadow-cta hover:shadow-card transition-shadow duration-200 p-3">
                    Tous les articles
                </Link>

            </div>

        </div>
    );
}