// PortfolioLayout.jsx
// Layout englobant toutes les pages "portfolio" (prestations, projets, formation).
// <Outlet /> est l'emplacement où React Router injecte la page active selon la route.
// Permet d'avoir une Navbar/Footer différents par zone du site (portfolio vs futur blog)
// sans dupliquer App.jsx ni casser l'existant.

import { Outlet } from "react-router-dom";
import Navbar from "../components/NavbarPortfolio";
import Footer from "../components/Footer";

export default function PortfolioLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}