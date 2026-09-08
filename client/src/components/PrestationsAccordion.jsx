// PrestationsAccordion.jsx
import { useState } from "react";

export default function PrestationsAccordion({ prestations }) {
    // Stocke l'id de l'ITEM ouvert (un seul à la fois, tous groupes confondus)
    const [openItemId, setOpenItemId] = useState(null);

    const toggleItem = (id) => {
        setOpenItemId(openItemId === id ? null : id);
    };

    return (
        <div className="grid grid-cols-1 mb-7 md:grid-cols-2 gap-8 w-full max-w-5xl">
            {prestations.map((categorie) => (
                <div key={categorie.id} className="shadow-cta p-5 flex flex-col items-center gap-4">

                    {/* Image de la catégorie */}
                    <img
                        src={categorie.image}
                        alt={categorie.title}
                        className="object-cover"
                    />

                    {/* Titre de la catégorie */}
                    <h3 className="text-2xl font-bold">{categorie.title}</h3>

                    {/* Liste des items en accordéon */}
                    <div className="flex flex-col gap-2 w-full">
                        {categorie.items.map((item) => {
                            const isOpen = openItemId === item.id;

                            return (
                                <div key={item.id} className="border-b border-black/10">
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        aria-expanded={isOpen}
                                        className="w-full flex items-center justify-between py-3 text-left hover:opacity-70 transition-opacity duration-200"
                                    >
                                        <span className="text-lg font-semibold">{item.title}</span>
                                        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                                            ▶
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <p className="text-base opacity-80 pb-3">{item.comment}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}