// Script de test isolé — vérifie que l'intégration Resend fonctionne
// avant de la brancher sur le vrai flux "mot de passe oublié".
// À supprimer une fois validé (ou garder comme outil de debug ponctuel).

require('dotenv').config({ quiet: true });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendTestEmail = async () => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // domaine de test fourni par Resend, fonctionne sans configuration DNS
            to: 'costes.fl@gmail.com', // remplace par ton adresse réelle pour recevoir le test
            subject: 'Test Resend — Le Bruisson Curieux',
            html: '<p>Si tu reçois ceci, Resend fonctionne correctement.</p>'
        });

        if (error) {
            console.error('Erreur Resend :', error);
            return;
        }

        console.log('Email envoyé avec succès, id :', data.id);
    } catch (err) {
        console.error('Erreur inattendue :', err);
    }
};

sendTestEmail();