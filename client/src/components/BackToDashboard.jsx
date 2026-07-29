// BackToDashboard.jsx
import { Link } from "react-router-dom";

export default function BackToDashboard() {
    return (
        <div className="w-full max-w-4xl">
            <Link to="/admin/dashboard" className="hover:opacity-70 transition-opacity duration-200">
                ← Retour au tableau de bord
            </Link>
        </div>
    );
}