// Modale générique de confirmation de suppression.
// Réutilisable pour tout type d'élément (projet, article, entrée CV...) —
// affiche le nom/titre de l'élément ciblé pour éviter une suppression accidentelle.

export default function ConfirmDeleteModal({ isOpen, itemLabel, onConfirm, onCancel }) {
    // Si la modale n'est pas ouverte, on ne rend rien du tout
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 shadow-cta flex flex-col gap-4 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold">Confirmer la suppression</h3>
                <p>
                    Tu es sur le point de supprimer définitivement :
                    <br />
                    <span className="font-bold">{itemLabel}</span>
                </p>
                <p className="text-sm opacity-70">Cette action est irréversible.</p>

                <div className="flex gap-3 justify-end mt-2">
                    <Btn contenu="Annuler" onClick={onCancel} />
                    <Btn contenu="Supprimer définitivement" onClick={onConfirm} variant="danger" />
                </div>
            </div>
        </div>
    );
}