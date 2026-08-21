// V1 : édition des champs simples du CV (identité, profil, contact).
// Les tableaux (expériences, formations, compétences...) restent édités via Compass pour l'instant.
//
// Point important : le back ne fait pas de fusion profonde sur les sous-objets Mongoose
// (identite, contact). Si on envoie un contact incomplet, les champs non envoyés
// (ex: reseaux, localisation) seraient effacés. On reconstruit donc toujours
// l'objet complet à partir des données déjà chargées, en ne modifiant que les champs édités ici.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useEditableArray } from "../../hooks/useEditableArray";
import api from "../../api/axiosConfig";
import FormInput from "../../components/FormInput";
import Btn from "../../components/Btn";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import ImageUploadInput from "../../components/ImageUploadInput";
import AccordionSection from "../../components/AccordionSection";

// Fonction de scroll fluide vers le haut de la page
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default function AdminCvPage() {

    // Convertit une date ISO (venant de MongoDB) en format "YYYY-MM-DD" attendu par <input type="date">
    function toDateInputValue(isoDate) {
        if (!isoDate) return "";
        return new Date(isoDate).toISOString().split("T")[0];
    }



    // Stocke le CV complet tel que reçu de l'API — sert de base pour ne pas perdre
    // les champs non édités ici (reseaux, localisation.ville, photo, etc.)
    const [cv, setCv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);




    // Champs simples
    const [nom, setNom] = useState("");
    const [titre, setTitre] = useState("");
    const [statut, setStatut] = useState("");
    const [recherche, setRecherche] = useState("");
    const [profil, setProfil] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [zones, setZones] = useState("");
    const [photo, setPhoto] = useState("");

    //tableau langues


    const langues = useEditableArray([], { langue: "", niveau: "" });

    // Hook pour le tableau réseaux
    const reseaux = useEditableArray([], { plateforme: "", url: "", icon: null });

    // Hooks pour les 3 tableaux
    const competencesTransverses = useEditableArray([], { categorie: "", details: "" });
    const blocsTechniques = useEditableArray([], { contexte: "", technologies: "" });
    const interets = useEditableArray([], { categorie: "", items: "" });

    const formations = useEditableArray([], {
        intitule: "", etablissement: "", niveau: "", modalite: "", specialisation: "",
        dateDebut: "", dateFin: "", enCours: false, description: ""
    });

    const experiences = useEditableArray([], {
        poste: "", contexte: "", type: "stage",
        dateDebut: "", dateFin: "", enCours: false, missions: ""
    });

    const disponibilites = useEditableArray([], {
        type: "", dateDebut: "", dateFin: "", note: "", formationCiblee: ""
    });

    useEffect(() => {
        api.get('/api/cv')
            .then((response) => {
                const data = response.data;
                setCv(data);

                setNom(data.identite.nom);
                setPhoto(data.identite.photo || "");
                setTitre(data.identite.titre);
                setStatut(data.identite.statut || "");
                setRecherche(data.identite.recherche || "");
                setProfil(data.profil);
                setEmail(data.contact.email);
                setTelephone(data.contact.telephone || "");
                setZones(data.contact.localisation?.zones?.join(", ") || "");
                langues.setAll(data.langues || []);
                reseaux.setAll(data.contact.reseaux || []);
                // Les sous-tableaux (details/technologies/items) sont convertis en texte pour l'édition,
                // reconvertis en tableau uniquement au moment du submit.
                competencesTransverses.setAll(
                    (data.competencesTransverses || []).map((c) => ({ ...c, details: c.details.join(", ") }))
                );
                blocsTechniques.setAll(
                    (data.blocsTechniques || []).map((b) => ({ ...b, technologies: b.technologies.join(", ") }))
                );
                interets.setAll(
                    (data.interets || []).map((i) => ({ ...i, items: i.items.join(", ") }))
                );
                formations.setAll(
                    (data.formations || []).map((f) => ({
                        ...f,
                        etablissement: f.etablissement || "",
                        niveau: f.niveau || "",
                        modalite: f.modalite || "",
                        specialisation: f.specialisation || "",
                        description: f.description || "",
                        dateDebut: toDateInputValue(f.dateDebut),
                        dateFin: toDateInputValue(f.dateFin),
                        enCours: !f.dateFin, // si dateFin est null en base, la formation est en cours

                    }))
                );
                experiences.setAll(
                    (data.experiences || []).map((exp) => ({
                        ...exp,
                        contexte: exp.contexte || "",
                        dateDebut: toDateInputValue(exp.dateDebut),
                        dateFin: toDateInputValue(exp.dateFin),
                        enCours: !exp.dateFin,
                        missions: (exp.missions || []).join("\n")
                    }))
                );
                disponibilites.setAll(
                    (data.disponibilites || []).map((d) => ({
                        ...d,
                        note: d.note || "",
                        formationCiblee: d.formationCiblee || "",
                        dateDebut: toDateInputValue(d.dateDebut),
                        dateFin: toDateInputValue(d.dateFin)
                    }))
                );
            })
            .catch(() => toast.error("Impossible de charger le CV."))
            .finally(() => setLoading(false));
    }, []);

    // --- Fonctions de gestion du tableau langues ---
    // Placées au même niveau que handleSubmit (pas à l'intérieur),
    // pour être accessibles depuis le JSX du formulaire plus bas.


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const zonesArray = zones
            .split(",")
            .map((z) => z.trim())
            .filter((z) => z.length > 0);

        // Reconstruction complète de "identite" : on garde "photo" tel quel (pas édité ici),
        // on écrase seulement les champs modifiés dans ce formulaire.
        const identiteData = {
            ...cv.identite,
            nom,
            titre,
            statut,
            recherche,
            photo
        };

        // Reconstruction complète de "contact" : on garde "reseaux" et le reste de
        // "localisation" (ville, codePostal) tels quels, on écrase email/telephone/zones.
        const contactData = {
            ...cv.contact,
            email,
            telephone,
            localisation: {
                ...cv.contact.localisation,
                zones: zonesArray
            },
            reseaux: reseaux.items
        };

        const competencesTransversesData = competencesTransverses.items.map((c) => ({
            categorie: c.categorie,
            details: c.details.split(",").map((d) => d.trim()).filter((d) => d.length > 0)
        }));

        const blocsTechniquesData = blocsTechniques.items.map((b) => ({
            contexte: b.contexte,
            technologies: b.technologies.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
        }));

        const interetsData = interets.items.map((i) => ({
            categorie: i.categorie,
            items: i.items.split(",").map((x) => x.trim()).filter((x) => x.length > 0)
        }));

        const formationsData = formations.items.map((f) => ({
            intitule: f.intitule,
            etablissement: f.etablissement,
            niveau: f.niveau,
            modalite: f.modalite,
            specialisation: f.specialisation,
            dateDebut: f.dateDebut,
            dateFin: f.enCours ? null : f.dateFin,
            description: f.description
        }));

        const experiencesData = experiences.items.map((exp) => ({
            poste: exp.poste,
            contexte: exp.contexte,
            type: exp.type,
            dateDebut: exp.dateDebut,
            dateFin: exp.enCours ? null : exp.dateFin,
            missions: exp.missions.split("\n").map((m) => m.trim()).filter((m) => m.length > 0)
        }));

        const disponibilitesData = disponibilites.items.map((d) => ({
            type: d.type,
            dateDebut: d.dateDebut,
            dateFin: d.dateFin || null,
            note: d.note,
            formationCiblee: d.formationCiblee
        }));

        try {
            const response = await api.patch('/api/cv', {
                identite: identiteData,
                profil,
                contact: contactData,
                langues: langues.items,
                competencesTransverses: competencesTransversesData,
                blocsTechniques: blocsTechniquesData,
                interets: interetsData,
                formations: formationsData,
                experiences: experiencesData,
                disponibilites: disponibilitesData
            });


            setCv(response.data);
            toast.success("CV mis à jour avec succès.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la mise à jour.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-center pt-15">Chargement...</p>;


    return (
        <div className="flex flex-col items-center gap-8 p-6 pt-15">

            <div className="w-full max-w-2xl">
                <Link to="/admin/dashboard" className="hover:opacity-70 transition-opacity duration-200">
                    ← Retour au tableau de bord
                </Link>
            </div>

            <h1 className="text-2xl font-bold">Modifier le CV</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl p-5 shadow-2xl gap-5 flex flex-col">

                <ImageUploadInput
                    label="Photo de profil"
                    currentImageUrl={photo}
                    onUploaded={(url) => setPhoto(url)}
                />
                <FormInput label="Nom" id="nom" value={nom}
                    onChange={(e) => setNom(e.target.value)} placeholder="Nom complet" />

                <FormInput label="Titre" id="titre" value={titre}
                    onChange={(e) => setTitre(e.target.value)} placeholder="Ex: Développeur fullstack" />

                <FormInput label="Statut" id="statut" value={statut} required={false}
                    onChange={(e) => setStatut(e.target.value)} placeholder="Ex: Freelance, En recherche..." />

                <FormInput label="Recherche" id="recherche" value={recherche} required={false}
                    onChange={(e) => setRecherche(e.target.value)} placeholder="Ex: CDI, alternance..." />

                <FormInput label="Profil" id="profil" as="textarea" value={profil}
                    onChange={(e) => setProfil(e.target.value)} placeholder="Présentation courte" />

                <FormInput label="Email" id="email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder="email@exemple.com" />

                <FormInput label="Téléphone" id="telephone" value={telephone} required={false}
                    onChange={(e) => setTelephone(e.target.value)} placeholder="06..." />

                <FormInput label="Zones géographiques (séparées par des virgules)" id="zones" value={zones} required={false}
                    onChange={(e) => setZones(e.target.value)} placeholder="Pau, Tarbes, Lourdes" />
                <hr className="w-auto mb-10" />
                <AccordionSection title="Langues">


                    {langues.items.map((langue, index) => (
                        <div key={index} className="flex gap-3 items-end shadow-card p-3">
                            <FormInput
                                label="Langue"
                                id={`langue-${index}`}
                                value={langue.langue}
                                onChange={(e) => langues.update(index, "langue", e.target.value)}
                                placeholder="Ex: Anglais"
                            />
                            <FormInput
                                label="Niveau"
                                id={`niveau-${index}`}
                                value={langue.niveau}
                                onChange={(e) => langues.update(index, "niveau", e.target.value)}
                                placeholder="Ex: B2, Courant..."

                            />
                            <Btn contenu="Retirer" onClick={() => langues.requestDelete(index)} variant="danger" />
                        </div>
                    ))}

                    <Btn contenu="Ajouter une langue" onClick={langues.add} />
                </AccordionSection>
                <hr className="w-auto mb-10" />
                <AccordionSection title="Réseaux">

                    {reseaux.items.map((reseau, index) => (
                        <div key={index} className="flex gap-3 items-end shadow-card p-3">
                            <FormInput
                                label="Plateforme"
                                id={`plateforme-${index}`}
                                value={reseau.plateforme}
                                onChange={(e) => reseaux.update(index, "plateforme", e.target.value)}
                                placeholder="Ex: GitHub"
                            />
                            <FormInput
                                label="URL"
                                id={`url-${index}`}
                                value={reseau.url}
                                onChange={(e) => reseaux.update(index, "url", e.target.value)}
                                placeholder="https://..."
                            />
                            <FormInput
                                label="Icône (chemin)"
                                id={`icon-${index}`}
                                value={reseau.icon || ""}
                                onChange={(e) => reseaux.update(index, "icon", e.target.value)}
                                placeholder="/images/icon-github.svg"
                                required={false}
                            />
                            <Btn contenu="Retirer" onClick={() => reseaux.requestDelete(index)} variant="danger" />
                        </div>
                    ))}

                    <Btn contenu="Ajouter un réseau" onClick={reseaux.add} />
                </AccordionSection>

                <hr className="w-auto mb-10" />

                <AccordionSection title="Compétences techniques">

                    {blocsTechniques.items.map((bloc, index) => (
                        <div key={index} className="flex gap-3 items-end shadow-card p-3">
                            <FormInput
                                label="Contexte"
                                id={`bloc-contexte-${index}`}
                                value={bloc.contexte}
                                onChange={(e) => blocsTechniques.update(index, "contexte", e.target.value)}
                                placeholder="Ex: Frontend"
                                as="textarea"
                            />
                            <FormInput
                                label="Technologies (séparées par des virgules)"
                                id={`bloc-technologies-${index}`}
                                value={bloc.technologies}
                                onChange={(e) => blocsTechniques.update(index, "technologies", e.target.value)}
                                placeholder="Ex: React, Tailwind"
                                as="textarea"
                            />
                            <Btn contenu="Retirer" onClick={() => blocsTechniques.requestDelete(index)} variant="danger" />
                        </div>
                    ))}

                    <Btn contenu="Ajouter une compétence technique" onClick={blocsTechniques.add} />
                </AccordionSection>
                <hr className="w-auto mb-10" />

                <AccordionSection title="Formations">

                    {formations.items.map((formation, index) => (
                        <div key={index} className="flex flex-col gap-3 shadow-card p-3">
                            <FormInput
                                label="Intitulé"
                                id={`formation-intitule-${index}`}
                                value={formation.intitule}
                                onChange={(e) => formations.update(index, "intitule", e.target.value)}
                                placeholder="Ex: Titre Pro DWWM"
                            />
                            <FormInput
                                label="Établissement"
                                id={`formation-etablissement-${index}`}
                                value={formation.etablissement}
                                required={false}
                                onChange={(e) => formations.update(index, "etablissement", e.target.value)}
                                placeholder="Ex: O'clock"
                            />
                            <FormInput
                                label="Niveau"
                                id={`formation-niveau-${index}`}
                                value={formation.niveau}
                                required={false}
                                onChange={(e) => formations.update(index, "niveau", e.target.value)}
                                placeholder="Ex: Bac+2"
                            />
                            <FormInput
                                label="Modalité"
                                id={`formation-modalite-${index}`}
                                value={formation.modalite}
                                required={false}
                                onChange={(e) => formations.update(index, "modalite", e.target.value)}
                                placeholder="Ex: À distance"
                            />
                            <FormInput
                                label="Spécialisation & options"
                                id={`formation-specialisation-${index}`}
                                value={formation.specialisation}
                                required={false}
                                onChange={(e) => formations.update(index, "specialisation", e.target.value)}
                                placeholder="Ex: Développement web"
                            />

                            <div className="flex gap-3">
                                <FormInput
                                    label="Date de début"
                                    id={`formation-dateDebut-${index}`}
                                    type="date"
                                    value={formation.dateDebut}
                                    onChange={(e) => formations.update(index, "dateDebut", e.target.value)}
                                />
                                <FormInput
                                    label="Date de fin"
                                    id={`formation-dateFin-${index}`}
                                    type="date"
                                    value={formation.dateFin}
                                    required={false}
                                    onChange={(e) => formations.update(index, "dateFin", e.target.value)}
                                />
                            </div>

                            {/* Checkbox natif, pas via FormInput (structure trop différente d'un champ texte) */}
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formation.enCours}
                                    onChange={(e) => formations.update(index, "enCours", e.target.checked)}
                                />
                                En cours
                            </label>

                            <FormInput
                                label="Description"
                                id={`formation-description-${index}`}
                                as="textarea"
                                value={formation.description}
                                required={false}
                                onChange={(e) => formations.update(index, "description", e.target.value)}
                                placeholder="Détail de la formation"
                            />

                            <Btn contenu="Retirer" onClick={() => formations.requestDelete(index)} variant="danger" />
                        </div>
                    ))}

                    <Btn contenu="Ajouter une formation" onClick={formations.add} />
                </AccordionSection>

                <hr className="w-auto mb-10" />
                <AccordionSection title="Expériences">
                    {experiences.items.map((exp, index) => (
                        <div key={index} className="flex flex-col gap-3 shadow-card p-3">
                            <FormInput
                                label="Poste"
                                id={`experience-poste-${index}`}
                                value={exp.poste}
                                onChange={(e) => experiences.update(index, "poste", e.target.value)}
                                placeholder="Ex: Développeur fullstack"
                            />
                            <FormInput
                                label="Contexte"
                                id={`experience-contexte-${index}`}
                                value={exp.contexte}
                                required={false}
                                onChange={(e) => experiences.update(index, "contexte", e.target.value)}
                                placeholder="Ex: Mission au sein d'une agence web"
                            />

                            {/* Select natif pour l'enum "type" — pas géré par FormInput, structure différente */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor={`experience-type-${index}`}>Type</label>
                                <select
                                    id={`experience-type-${index}`}
                                    value={exp.type}
                                    onChange={(e) => experiences.update(index, "type", e.target.value)}
                                    className="w-full shadow-card p-3"
                                >
                                    <option value="stage">Stage</option>
                                    <option value="salarie">Salarié</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <FormInput
                                    label="Date de début"
                                    id={`experience-dateDebut-${index}`}
                                    type="date"
                                    value={exp.dateDebut}
                                    onChange={(e) => experiences.update(index, "dateDebut", e.target.value)}
                                />
                                <FormInput
                                    label="Date de fin"
                                    id={`experience-dateFin-${index}`}
                                    type="date"
                                    value={exp.dateFin}
                                    required={false}
                                    onChange={(e) => experiences.update(index, "dateFin", e.target.value)}
                                />
                            </div>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={exp.enCours}
                                    onChange={(e) => experiences.update(index, "enCours", e.target.checked)}
                                />
                                En cours
                            </label>

                            <FormInput
                                label="Missions (une par ligne)"
                                id={`experience-missions-${index}`}
                                as="textarea"
                                value={exp.missions}
                                onChange={(e) => experiences.update(index, "missions", e.target.value)}
                                placeholder={"Ex:\nDéveloppement de fonctionnalités front\nCorrection de bugs"}
                            />

                            <Btn contenu="Retirer" onClick={() => experiences.requestDelete(index)} variant="danger" />
                        </div>
                    ))}

                    <Btn contenu="Ajouter une expérience" onClick={experiences.add} />
                </AccordionSection>

                <hr className="w-auto mb-10" />

                <AccordionSection title="Compétences transverses">

                    {competencesTransverses.items.map((comp, index) => (
                        <div key={index} className="flex gap-3 items-end shadow-card p-3">
                            <FormInput
                                label="Catégorie"
                                id={`competence-categorie-${index}`}
                                value={comp.categorie}
                                onChange={(e) => competencesTransverses.update(index, "categorie", e.target.value)}
                                placeholder="Ex: Communication"
                            />
                            <FormInput
                                label="Détails (séparés par des virgules)"
                                id={`competence-details-${index}`}
                                value={comp.details}
                                onChange={(e) => competencesTransverses.update(index, "details", e.target.value)}
                                placeholder="Ex: Écoute active, Pédagogie"
                            />
                            <Btn contenu="Retirer" onClick={() => competencesTransverses.requestDelete(index)} variant="danger" />
                        </div>
                    ))}

                    <Btn contenu="Ajouter une compétence" onClick={competencesTransverses.add} />
                </AccordionSection>

                <hr className="w-auto mb-10" />

                <AccordionSection title="Centres d'intérêt">

                    {interets.items.map((interet, index) => (
                        <div key={index} className="flex gap-3 items-end shadow-card p-3">
                            <FormInput
                                label="Catégorie"
                                id={`interet-categorie-${index}`}
                                value={interet.categorie}
                                onChange={(e) => interets.update(index, "categorie", e.target.value)}
                                placeholder="Ex: Musique"
                            />
                            <FormInput
                                label="Items (séparés par des virgules)"
                                id={`interet-items-${index}`}
                                value={interet.items}
                                onChange={(e) => interets.update(index, "items", e.target.value)}
                                placeholder="Ex: Sound design, Composition"
                            />
                            <Btn contenu="Retirer" onClick={() => interets.requestDelete(index)} variant="danger" />
                        </div>
                    ))}

                    <Btn contenu="Ajouter un intérêt" onClick={interets.add} />
                </AccordionSection>

                <hr className="w-auto mb-10" />

                <AccordionSection title="Disponibilités">
                    {disponibilites.items.map((dispo, index) => (
                        <div key={index} className="flex flex-col gap-3 shadow-card p-3">
                            <FormInput
                                label="Type"
                                id={`dispo-type-${index}`}
                                value={dispo.type}
                                onChange={(e) => disponibilites.update(index, "type", e.target.value)}
                                placeholder="Ex: Immédiate, Alternance..."
                            />

                            <div className="flex gap-3">
                                <FormInput
                                    label="Date de début"
                                    id={`dispo-dateDebut-${index}`}
                                    type="date"
                                    value={dispo.dateDebut}
                                    onChange={(e) => disponibilites.update(index, "dateDebut", e.target.value)}
                                />
                                <FormInput
                                    label="Date de fin"
                                    id={`dispo-dateFin-${index}`}
                                    type="date"
                                    value={dispo.dateFin}
                                    required={false}
                                    onChange={(e) => disponibilites.update(index, "dateFin", e.target.value)}
                                />
                            </div>

                            <FormInput
                                label="Note"
                                id={`dispo-note-${index}`}
                                as="textarea"
                                value={dispo.note}
                                required={false}
                                onChange={(e) => disponibilites.update(index, "note", e.target.value)}
                                placeholder="Précisions sur cette disponibilité"
                            />

                            <FormInput
                                label="Formation ciblée"
                                id={`dispo-formationCiblee-${index}`}
                                value={dispo.formationCiblee}
                                required={false}
                                onChange={(e) => disponibilites.update(index, "formationCiblee", e.target.value)}
                                placeholder="Ex: Alternance DWWM"
                            />

                            <Btn contenu="Retirer" onClick={() => disponibilites.requestDelete(index)} variant="danger" />
                        </div>
                    ))}

                    <Btn contenu="Ajouter une disponibilité" onClick={disponibilites.add} />
                </AccordionSection>

                <hr className="w-auto mb-10" />

                <Btn contenu={saving ? "Enregistrement..." : "Enregistrer les modifications"} type="submit" />

                {/* /////////////////////////////////  DOUBLE CONFIRMATION  ///////////////////////////////// */}
                <ConfirmDeleteModal
                    isOpen={langues.indexToDelete !== null}
                    itemLabel={langues.indexToDelete !== null ? langues.items[langues.indexToDelete]?.langue || "cette langue" : ""}
                    onConfirm={langues.confirmDelete}
                    onCancel={langues.cancelDelete}
                />
                <ConfirmDeleteModal
                    isOpen={reseaux.indexToDelete !== null}
                    itemLabel={reseaux.indexToDelete !== null ? reseaux.items[reseaux.indexToDelete]?.plateforme || "ce réseau" : ""}
                    onConfirm={reseaux.confirmDelete}
                    onCancel={reseaux.cancelDelete}
                />
                <ConfirmDeleteModal
                    isOpen={competencesTransverses.indexToDelete !== null}
                    itemLabel={competencesTransverses.indexToDelete !== null ? competencesTransverses.items[competencesTransverses.indexToDelete]?.categorie || "cette compétence" : ""}
                    onConfirm={competencesTransverses.confirmDelete}
                    onCancel={competencesTransverses.cancelDelete}
                />
                <ConfirmDeleteModal
                    isOpen={blocsTechniques.indexToDelete !== null}
                    itemLabel={blocsTechniques.indexToDelete !== null ? blocsTechniques.items[blocsTechniques.indexToDelete]?.contexte || "ce bloc" : ""}
                    onConfirm={blocsTechniques.confirmDelete}
                    onCancel={blocsTechniques.cancelDelete}
                />
                <ConfirmDeleteModal
                    isOpen={interets.indexToDelete !== null}
                    itemLabel={interets.indexToDelete !== null ? interets.items[interets.indexToDelete]?.categorie || "cet intérêt" : ""}
                    onConfirm={interets.confirmDelete}
                    onCancel={interets.cancelDelete}
                />
                <ConfirmDeleteModal
                    isOpen={formations.indexToDelete !== null}
                    itemLabel={formations.indexToDelete !== null ? formations.items[formations.indexToDelete]?.intitule || "cette formation" : ""}
                    onConfirm={formations.confirmDelete}
                    onCancel={formations.cancelDelete}
                />
                <ConfirmDeleteModal
                    isOpen={experiences.indexToDelete !== null}
                    itemLabel={experiences.indexToDelete !== null ? experiences.items[experiences.indexToDelete]?.poste || "cette expérience" : ""}
                    onConfirm={experiences.confirmDelete}
                    onCancel={experiences.cancelDelete}
                />
                <ConfirmDeleteModal
                    isOpen={disponibilites.indexToDelete !== null}
                    itemLabel={disponibilites.indexToDelete !== null ? disponibilites.items[disponibilites.indexToDelete]?.type || "cette disponibilité" : ""}
                    onConfirm={disponibilites.confirmDelete}
                    onCancel={disponibilites.cancelDelete}
                />
            </form>
            <div className="w-full max-w-2xl flex justify-end sticky bottom-8">
                <button
                    type="button"
                    onClick={scrollToTop}
                    aria-label="Remonter en haut de la page"
                    className="translate-x-full shadow-cta hover:shadow-card transition-shadow duration-200 p-4 cursor-pointer bg-black text-white"
                >
                    ↑
                </button>
            </div>
        </div>
    );
}