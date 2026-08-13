// Hook personnalisé factorisant la logique commune à tous les tableaux éditables du CV
// (langues, réseaux, compétences, formations...) : ajout, modification, suppression
// avec confirmation via modale.
//
// Usage : const langues = useEditableArray(initialData.langues, { langue: "", niveau: "" });
// Puis : langues.items, langues.add(), langues.update(index, field, value),
// langues.requestDelete(index), langues.confirmDelete(), langues.cancelDelete(),
// langues.indexToDelete (pour piloter la modale)

import { useState } from "react";

export function useEditableArray(initialItems = [], emptyItemTemplate = {}) {
    const [items, setItems] = useState(initialItems);
    const [indexToDelete, setIndexToDelete] = useState(null);

    // Ajoute une nouvelle ligne vide, basée sur le template fourni
    const add = () => {
        setItems([...items, { ...emptyItemTemplate }]);
    };

    // Met à jour un champ précis d'une ligne précise
    const update = (index, field, value) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    };

    // Ouvre la modale de confirmation pour l'index ciblé
    const requestDelete = (index) => {
        setIndexToDelete(index);
    };

    // Ferme la modale sans supprimer
    const cancelDelete = () => {
        setIndexToDelete(null);
    };

    // Confirme réellement la suppression
    const confirmDelete = () => {
        setItems(items.filter((_, i) => i !== indexToDelete));
        setIndexToDelete(null);
    };

    // Permet de resynchroniser tout le tableau d'un coup
    // (utile après le fetch initial du CV, une fois les données chargées)
    const setAll = (newItems) => {
        setItems(newItems);
    };

    return { items, add, update, requestDelete, cancelDelete, confirmDelete, indexToDelete, setAll };
}