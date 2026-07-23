export default function ProfileCard({ name, image }) {
    return (
        <div className='shadow-cta p-3 flex flex-col items-center w-fit gap-3'>
            {name && <h1 className="text-4xl">{name}</h1>}
            <img
                src={image}
                alt={name || "Photo de profil"}
                className="w-80 h-80 object-top object-cover"
            />
        </div>
    )
}