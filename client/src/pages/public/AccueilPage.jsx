// Page d'accueil du Blog — point d'entrée du site (redirection depuis "/").
// Contenu minimal pour l'instant, à enrichir (mise en avant d'articles récents, etc.).

export default function AccueilPage() {
    return (
        <div className="flex flex-col items-center justify-center gap-6 p-6 pt-15 min-h-[60vh]">
            <h1 className="text-4xl font-bold">Le Bruisson Curieux</h1>
            <p className="text-lg opacity-70">Analyses sonores — jeux vidéo, films, séries.</p>
        </div>
    );
}