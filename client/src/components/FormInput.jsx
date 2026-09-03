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

export default function FormInput({ label, id, type = "text", value, onChange, placeholder, as = "input", required = true, className = "" }) {

    // Même classe visuelle pour les deux versions (input et textarea),
    // pour garder un style cohérent dans tout le formulaire sans dupliquer les classes Tailwind.
    const baseClassName = `w-full shadow-card p-3 ${className}`

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id}>{label}</label>

            {as === "textarea" ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    rows={5}
                    className={baseClassName}
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