// Footer.jsx
// Liens de contact (GitHub externe + email) + mentions légales.

import EmailButton from "./EmailButton";

export default function Footer() {

    return (
        <footer className="text-base px-5 py-5 md:h-20 grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-black text-black items-center mt-15 text-center md:text-left">
            <div className="flex gap-7 justify-center md:justify-start">
                <a
                    href="https://github.com/CFrian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='p-1 rounded-xl hover:shadow-card duration-200'
                    aria-label="Voir mon profil GitHub"
                >
                    <img src="/icon-github.svg" alt="GitHub" className="w-12 h-12" />
                </a>

                <EmailButton />
            </div>
            <div className="hidden md:block"></div>

            <div className="flex flex-col justify-center items-center md:items-end">
                <p>Florian Costes portfolio - tous droits réservés - 2026</p>
                <p className="italic">Designed by CFrian</p>
            </div>
        </footer >
    );
}