// import visibiliteEnLineImg from "../assets/images/VisibilitéNumerique.png"
// import venteEnLigneImg from "../assets/images/venteEnLigne.png"
// import outilMetierImg from "../assets/images/OutilMetierSurMesure.png"
// import productionAudioImg from "../assets/images/productionAudio.png"
// import formationsAteliersImg from "../assets/images/formationsAteliers.png"
import experienceInteractiveImg from "../assets/images/ExperienceInteractive.png"
import soundDesignImg from "../assets/images/soundDesign.png"


export const prestations = [
    {
        id: "audio",
        image: soundDesignImg,
        title: "Audio",
        comment: "Production, mixage, sound design, identité sonore, formations — du studio à la livraison",
        items: [
            {
                id: "production-audio",
                title: "Pré-production & Post-production",
                comment: "Enregistrement, montage, mixage — livraison aux normes Web, ciné, pub ou Podcast"
            },
            {
                id: "sound-design",
                title: "Sound Design & Création sonore",
                comment: "Habillage sonore, jingles, identité sonore, bruitages, SFX — pour la vidéo, le jeu ou le podcast"
            },
            {
                id: "formations-ateliers",
                title: "Formations & Ateliers",
                comment: "Production sonore, atelier bruitage & podcast, vulgarisation audio, accompagnement personnalisé"
            },
        ]
    },
    {
        id: "developpement",
        image: experienceInteractiveImg,
        title: "Développement web",
        comment: "Sites, e-commerce, outils métier, expériences interactives — du besoin à la mise en ligne",
        items: [
            {
                id: "presence-en-ligne",
                title: "Présence en ligne",
                comment: "Site vitrine, portfolio, blog — avec ou sans espace admin pour gérer le contenu"
            },
            {
                id: "vente-en-ligne",
                title: "Vente en ligne",
                comment: "Shop, parcours client, paiement Stripe, gestion des commandes"
            },
            {
                id: "outil-metier",
                title: "Outil métier sur mesure",
                comment: "Formulaire intelligent, interface admin, automatisation de tâches répétitives"
            },
            {
                id: "experience-interactive",
                title: "Expérience interactive",
                comment: "Soundboard, interface audio, appli web originale"
            },
        ]
    },
];