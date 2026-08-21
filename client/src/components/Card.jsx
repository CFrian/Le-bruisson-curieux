// Affiche une prestation ou un projet.
// Si stacks/lienDemo/lienRepo sont fournis (cas "projet"), les boutons correspondants
// s'affichent conditionnellement — une prestation simple n'affiche que l'image/titre/comment.

export default function Card({ image, title, comment, stacks, lienDemo, lienRepo }) {
    return (
        <div className="shadow-cta p-6 flex flex-col items-center w-full gap-6">
            <div className="h-50 ">
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="h-50 flex flex-col justify-center">
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-[1.3rem]">{comment}</p>
                {stacks && <p className="italic mt-7">{stacks}</p>}
            </div>

            {/* Liens externes — <a> classique, pas Btn/Link (réservé à la navigation interne).
                target="_blank" + rel="noopener noreferrer" : protection reverse tabnabbing,
                obligatoire sur tout lien externe ouvert dans un nouvel onglet. */}
            <div className="flex gap-3">
                {lienDemo && (

                    <a href={lienDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shadow-cta hover:shadow-card transition-shadow duration-200 p-2 mt-3"
                    >
                        Voir le site
                    </a>
                )}
                {lienRepo && (
                    <a
                        href={lienRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shadow-cta hover:shadow-card transition-shadow duration-200 p-2 mt-3"
                    >
                        GitHub
                    </a>
                )
                }
            </div >
        </div >
    )
}