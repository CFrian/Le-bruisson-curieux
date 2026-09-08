// Champ de formulaire réutilisable, utilisé dans tous les formulaires de l'app
// (Login, ChangePassword, ProjectForm...).
//
// Par défaut, rend un <input> simple.
// Avec la prop as="textarea", rend une zone de texte multiligne à la place —
// utile pour les champs longs (ex: description d'un projet) où un input sur
// une seule ligne oblige à scroller horizontalement pour relire son texte.
// required={false} → rend le champ optionnel (ex: lien démo, lien repo,
// pas toujours disponibles au moment de la création d'un projet).
// className → classes Tailwind additionnelles, fusionnées avec le style par défaut
// (ex: bordure colorée pour distinguer visuellement une zone du formulaire).

import { useRef, useEffect } from "react";

export default function FormInput({ label, id, type = "text", value, onChange, placeholder, as = "input", required = true, className = "" }) {

    const baseClassName = `w-full shadow-card p-3 ${className}`
    const textareaRef = useRef(null);

    // Recalcule la hauteur à chaque changement de valeur — couvre la saisie clavier
    // ET le pré-remplissage en mode édition (chargement d'un article existant).
    useEffect(() => {
        if (as === "textarea" && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value, as]);

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id}>{label}</label>

            {as === "textarea" ? (
                <textarea
                    ref={textareaRef}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    rows={3}
                    // resize-none : on désactive la poignée manuelle du navigateur,
                    // puisque la hauteur est désormais pilotée automatiquement.
                    // overflow-hidden : évite un scroll interne parasite pendant le recalcul.
                    className={`${baseClassName} resize-none overflow-hidden`}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={baseClassName}
                />
            )}
        </div>
    )
}