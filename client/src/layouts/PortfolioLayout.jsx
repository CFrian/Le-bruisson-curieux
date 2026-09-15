import { Outlet } from "react-router-dom";
import NavbarPortfolio from "../components/NavbarPortfolio";
import Footer from "../components/Footer";

export default function PortfolioLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarPortfolio />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}