// Footer.jsx
// Liens de contact (GitHub externe + email) + mentions légales.

import EmailButton from "./EmailButton";

export default function Footer() {

    return (
        <footer className="text-base h-20 px-5 grid grid-cols-3 border-t-2 border-black text-black items-center mt-15">
            <div className="flex gap-7">
                {/* Lien externe (autre domaine) → 2 règles de sécurité obligatoires ensemble :
                    - target="_blank" : ouvre un nouvel onglet
                    - rel="noopener noreferrer" : SANS ça, la page ouverte (github.com) a accès
                      à window.opener et peut rediriger ton onglet d'origine vers une page malveillante
                      (attaque "reverse tabnabbing"). Règle : JAMAIS de target="_blank" sans ce rel. */}
                <a
                    href="https://github.com/CFrian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='ml-auto p-1 rounded-xl hover:shadow-card duration-200'
                    aria-label="Voir mon profil GitHub"
                >
                    <img src="/icon-github.svg" alt="GitHub" className="w-12 h-12" />
                </a>

                {/* mailto: n'ouvre PAS un nouvel onglet web avec accès à window.opener
                    → pas de risque de reverse tabnabbing ici.
                    Email construit dynamiquement (voir reversedEmail ci-dessus) pour limiter le scraping. */}

                <EmailButton />
            </div>
            <div></div>
            <div className="flex flex-col justify-center">
                <p>Florian Costes portfolio - tous droits réservés - 2026</p>
                <p className="italic">Designed by CFrian</p>
            </div>
        </footer>
    );
}