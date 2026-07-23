import Btn from "./Btn"

export default function Card({ image, title, comment, stacks, path }) {
    return (
        <div className="shadow-cta p-5 flex flex-col items-center w-100 gap-10">
            <div className="h-50">
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="h-50 flex flex-col justify-center">
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-[1.2rem]">{comment}</p>
                {stacks && <p className="italic mt-7">{stacks}</p>}
            </div>
            <div>
                {/* Réutilise Btn en mode navigation (path fourni → rendu comme un Link) */}
                {path && <Btn contenu="En savoir plus" path={path} />}
            </div>
        </div>
    )
}