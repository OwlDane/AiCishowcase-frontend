"use client";

import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center">
            {/* Logo Section */}
            <div className="flex-1 flex justify-start">
                <Image
                    src="/aici-logo.png"
                    alt="AiCI Logo"
                    width={180}
                    height={60}
                    className="h-14 w-auto object-contain"
                />
            </div>

            {/* Links Section - Centered */}
            <div className="flex items-center gap-12">
                <Link href="/" className="text-primary font-bold hover:opacity-80 transition-opacity">
                    Home
                </Link>
                <Link href="/projects" className="text-primary font-medium hover:opacity-80 transition-opacity">
                    Projects
                </Link>
                <Link href="/achievements" className="text-primary font-medium hover:opacity-80 transition-opacity">
                    Achievements
                </Link>
            </div>

            {/* Placeholder to balance the centering */}
            <div className="flex-1 flex justify-end">
                {/* Future Search or Profile Icon can go here */}
            </div>
        </nav>
    );
};

export default Navbar;
