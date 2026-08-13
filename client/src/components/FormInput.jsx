// FormInput.jsx
// Champ de formulaire réutilisable, utilisé dans tous les formulaires de l'app
// (Login, ChangePassword, ProjectForm...).
//
// Par défaut, rend un <input> simple.
// Avec la prop as="textarea", rend une zone de texte multiligne à la place —
// utile pour les champs longs (ex: description d'un projet) où un input sur
// une seule ligne oblige à scroller horizontalement pour relire son texte.
// required={false} → rend le champ optionnel (ex: lien démo, lien repo,
// pas toujours disponibles au moment de la création d'un projet).


export default function FormInput({ label, id, type = "text", value, onChange, placeholder, as = "input", required = true }) {

    // Même classe visuelle pour les deux versions (input et textarea),
    // pour garder un style cohérent dans tout le formulaire sans dupliquer les classes Tailwind.
    const className = "w-full shadow-card p-3"

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id}>{label}</label>

            {/* Rendu conditionnel selon la valeur de "as" :
                - "textarea" → zone de texte multiligne, hauteur de départ fixée par rows
                - autre valeur (ou absente) → input classique, comme avant */}
            {as === "textarea" ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    // rows={5} : hauteur de départ (5 lignes visibles) avant tout redimensionnement.
                    // L'utilisateur peut ensuite agrandir manuellement la zone
                    // grâce au comportement natif du navigateur (coin redimensionnable).
                    rows={5}
                    className={className}
                />
            ) : (
                <input
                    id={id}
                    // type reste utile ici : "email", "password", "text"... selon l'usage du champ
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={className}
                />
            )}
        </div>
    )
}