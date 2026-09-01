import { Outlet } from 'react-router-dom';
import NavbarBlog from '../components/NavbarBlog';
import Footer from '../components/Footer';

export default function BlogLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarBlog />
            <main className="flex-1"><Outlet /></main>
            <Footer />
        </div>
    );
}