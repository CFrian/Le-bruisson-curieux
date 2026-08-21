// CvPage.jsx
// Page publique affichant le CV complet, récupéré depuis MongoDB.

import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import ProfileCard from "../../components/ProfileCard";
import SectionTitle from "../../components/SectionTitle";
import PanelBorderLR from "../../components/PanelBorderLR";

// Formate une date Mongo (ISO) en "mois année" français. dateFin null → "En cours".
function formatDate(date) {
    if (!date) return "En cours";
    return new Date(date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export default function CvPage() {
    const [cv, setCv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/api/cv')
            .then((response) => {
                // Le CV est un document unique — si l'API renvoie un tableau, on prend le premier élément
                const data = Array.isArray(response.data) ? response.data[0] : response.data;
                setCv(data);
            })
            .catch(() => setError("Impossible de charger le CV."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center pt-15">Chargement...</p>;
    if (error) return <p className="text-center pt-15 text-red-600">{error}</p>;
    if (!cv) return <p className="text-center pt-15">Aucun CV disponible.</p>;

    return (
        <div className="flex flex-col items-center p-6 gap-12 pt-15 max-w-4xl mx-auto">

            {/* Identité */}
            <ProfileCard image={cv.identite.photo} name={cv.identite.nom} />
            <div className="text-center">
                <h2 className="text-2xl font-bold">{cv.identite.titre}</h2>
                {cv.identite.statut && <p className="italic">{cv.identite.statut}</p>}
                {cv.identite.recherche && <p>{cv.identite.recherche}</p>}
            </div>

            {/* Profil */}
            <PanelBorderLR>
                <p>{cv.profil}</p>
            </PanelBorderLR>

            {/* Contact */}
            <div className="w-full">
                <SectionTitle title="Contact" />
                <div className="shadow-card p-4 mt-4 flex flex-col gap-2 items-start">
                    <p>
                        <span className="font-bold ">Contact : </span>{" "}
                        {cv.contact.email} {cv.contact.telephone}
                    </p>

                    {cv.contact.localisation && (
                        <p>
                            <span className="font-bold">Zone géographique : </span>{" "}
                            {cv.contact.localisation.zones.join(", ")}
                        </p>
                    )}

                    {cv.contact.reseaux?.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="font-bold">Réseaux : </span>

                            {cv.contact.reseaux.map((reseau) => (
                                <a
                                    key={reseau._id}
                                    href={reseau.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:opacity-70 transition-opacity duration-200"
                                >
                                    {reseau.icon ? (
                                        <img src={reseau.icon} alt="" className="w-6 h-6" />
                                    ) : (
                                        <span>{reseau.plateforme}</span>
                                    )}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Blocs techniques */}
            <div className="w-full">
                <SectionTitle title="Compétences techniques" />
                <div className="flex flex-col gap-4 mt-4">
                    {cv.blocsTechniques.map((bloc) => (
                        <div key={bloc._id} className="shadow-card p-4">
                            <h4 className="font-bold">{bloc.contexte}</h4>
                            <p>{bloc.technologies.join(" · ")}</p>
                        </div>
                    ))}
                </div>
            </div>



            {/* Expériences */}
            <div className="w-full">
                <SectionTitle title="Expériences" />
                <div className="flex flex-col gap-6 mt-4">
                    {cv.experiences.map((exp) => (
                        <div key={exp._id} className="shadow-card p-4">
                            <h3 className="text-xl font-bold">{exp.poste}</h3>
                            <p className="italic">
                                {formatDate(exp.dateDebut)} — {formatDate(exp.dateFin)} · {exp.type}
                            </p>
                            {exp.contexte && <p className="mt-1">{exp.contexte}</p>}
                            <ul className="list-disc list-inside mt-2">
                                {exp.missions.map((mission, index) => (
                                    <li key={index}>{mission}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Formations */}
            <div className="w-full">
                <SectionTitle title="Formations" />
                <div className="flex flex-col gap-6 mt-4">
                    {cv.formations.map((formation) => (
                        <div key={formation._id} className="shadow-card p-4">
                            <h3 className="text-xl font-bold">{formation.intitule}</h3>
                            <p className="italic">
                                {formation.etablissement} · {formatDate(formation.dateDebut)} — {formatDate(formation.dateFin)}
                            </p>
                            {formation.description && <p className="mt-1">{formation.description}</p>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Compétences transverses */}
            <div className="w-full">
                <SectionTitle title="Compétences transverses" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {cv.competencesTransverses.map((comp) => (
                        <div key={comp._id} className="shadow-card p-4">
                            <h4 className="font-bold">{comp.categorie}</h4>
                            <p>{comp.details.join(", ")}</p>
                        </div>
                    ))}
                </div>
            </div>


            {/* Langues */}
            <div className="w-full">
                <SectionTitle title="Langues" />
                <div className="shadow-card p-4 mt-4 flex flex-col gap-2 items-start">
                    {cv.langues.map((langue) => (
                        <p key={langue._id}>{langue.langue} — {langue.niveau}</p>
                    ))}
                </div>
            </div>

            {/* Centres d'intérêt */}
            {
                cv.interets?.length > 0 && (
                    <div className="w-full">
                        <SectionTitle title="Centres d'intérêt" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {cv.interets.map((interet) => (
                                <div key={interet._id} className="shadow-card p-4">
                                    <h4 className="font-bold">{interet.categorie}</h4>
                                    <p>{interet.items.join(", ")}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }

            {
                cv.disponibilites?.length > 0 && (
                    <div className="w-full">
                        <SectionTitle title="Disponibilités" />
                        <div className="flex flex-col gap-4 mt-4">
                            {cv.disponibilites.map((dispo) => (
                                <div key={dispo._id} className="shadow-card p-4">
                                    <h4 className="font-bold">{dispo.type}</h4>
                                    <p className="italic">
                                        {formatDate(dispo.dateDebut)} {dispo.dateFin && `— ${formatDate(dispo.dateFin)}`}
                                    </p>
                                    {dispo.note && <p className="mt-1">{dispo.note}</p>}
                                    {dispo.formationCiblee && <p className="italic mt-1">{dispo.formationCiblee}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}



            {/* Téléchargement du CV en PDF — fichier statique, pas lié aux données dynamiques du CV en ligne */}
            <a
                href="/files/CV_Florian-Costes.pdf"
                download
                className="shadow-cta hover:shadow-card transition-shadow duration-200 p-3 font-bold "
            >
                Télécharger le CV (PDF)
            </a>

        </div >
    );
}

