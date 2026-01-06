"use client";

import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
                <Image
                    src="/aici-logo.png"
                    alt="AiCI Logo"
                    width={120}
                    height={40}
                    className="h-10 w-auto object-contain"
                />
            </div>

            <div className="flex items-center gap-8">
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
        </nav>
    );
};

export default Navbar;
