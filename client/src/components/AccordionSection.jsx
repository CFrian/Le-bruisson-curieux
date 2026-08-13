// Section pliable/dépliable générique, utilisée pour alléger visuellement
// un formulaire long (ex: AdminCvPage) en regroupant chaque bloc sous un titre cliquable.
//
// Contrairement à l'accordéon des prestations (une seule catégorie ouverte à la fois),
// chaque AccordionSection gère son propre état d'ouverture, indépendant des autres —
// utile ici car on peut vouloir éditer plusieurs sections en même temps.

import { useState } from "react";

export default function AccordionSection({ title, children, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="shadow-card">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:opacity-70 transition-opacity duration-200"
            >
                <h3 className="text-xl font-bold">{title}</h3>
                <span className={`text-2xl transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="flex flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            )}
        </div>
    );
}