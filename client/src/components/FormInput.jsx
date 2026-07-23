export default function FormInput({ label, id, type = "text", value, onChange, placeholder }) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                className="w-full shadow-card p-3"
            />
        </div>
    );
}