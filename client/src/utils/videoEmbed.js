// Détecte la plateforme vidéo (YouTube/Vimeo) depuis une URL classique,
// et construit l'URL d'intégration (embed) nécessaire pour un <iframe>.
// enablejsapi=1 (YouTube) et le player Vimeo standard sont activés dès maintenant
// pour préparer le contrôle programmatique du timecode (fonctionnalité à venir).

export function getVideoEmbed(url) {
    if (!url) return null;

    // YouTube : watch?v=ID, youtu.be/ID, déjà en embed/ID
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (youtubeMatch) {
        return {
            type: 'youtube',
            embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?enablejsapi=1`,
        };
    }

    // Vimeo : vimeo.com/ID, player.vimeo.com/video/ID
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
        return {
            type: 'vimeo',
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
        };
    }

    return null; // URL non reconnue — on retombe sur l'affichage brut en dernier recours
}