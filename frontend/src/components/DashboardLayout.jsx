import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen font-sans flex flex-col text-slate-800">
            <Header />

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in relative z-10">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default DashboardLayout;
