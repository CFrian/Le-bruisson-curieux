import Btn from "./Btn";

export default function ConfirmDeleteModal({ isOpen, itemLabel, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white p-6 shadow-cta flex flex-col gap-4 max-w-md w-full">
                <h3 className="text-xl font-bold">Confirmer la suppression</h3>
                <p>
                    Tu es sur le point de supprimer définitivement :
                    <br />
                    <span className="font-bold">{itemLabel}</span>
                </p>
                <p className="text-sm opacity-70">Cette action est irréversible.</p>

                <div className="flex flex-col items-center sm:flex-row gap-3 sm:justify-end mt-2">
                    <Btn contenu="Annuler" onClick={onCancel} />
                    <Btn contenu="Supprimer définitivement" onClick={onConfirm} variant="danger" />
                </div>
            </div>
        </div>
    );
}