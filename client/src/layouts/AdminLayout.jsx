import { Outlet } from 'react-router-dom';
import NavbarAdmin from '../components/NavbarAdmin';
import Footer from '../components/Footer';

export default function AdminLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarAdmin />
            <main className="flex-1"><Outlet /></main>
            <Footer />
        </div>
    );
}