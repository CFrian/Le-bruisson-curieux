// Affiche une prestation, un projet ou un article.
import Btn from "./Btn";

export default function Card({ image, title, comment, stacks, lienDemo, lienRepo, path, linkLabel = "En savoir plus" }) {
    return (
        <div className="shadow-cta p-6 flex flex-col items-center w-full gap-6">
            <div className="h-50 w-full">
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="h-50 flex flex-col justify-center">
                <h3 className="text-2xl max-[370px]:text-lg font-bold">{title}</h3>
                <p className="text-sm max-[370px]:text-xs">{comment}</p>
                {stacks && <p className="italic mt-7">{stacks}</p>}
            </div>

            {path && <Btn contenu={linkLabel} path={path} />}

            <div className="flex flex-col sm:flex-row gap-3">
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
                    <a href={lienRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shadow-cta hover:shadow-card transition-shadow duration-200 p-2 mt-3"
                    >
                        GitHub
                    </a>
                )}
            </div>
        </div>
    )
}