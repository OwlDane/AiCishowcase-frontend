"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LikePopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const LikePopup = ({ isOpen, onClose }: LikePopupProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                handleClose();
            }, 3000); // Auto-close after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for transition
    };

    if (!isOpen && !isVisible) return null;

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-300 ${
                isVisible ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-0"
            }`}
        >
            <div 
                className="absolute inset-0 bg-primary/10" 
                onClick={handleClose} 
            />
            
            <div 
                className={`relative bg-white rounded-[3rem] shadow-2xl p-8 md:p-10 w-full max-w-sm text-center border border-gray-100 transition-all duration-300 transform ${
                    isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
                }`}
            >
                <div className="w-40 h-40 mx-auto mb-6">
                    <DotLottieReact
                        src="/Anima Bot.json"
                        loop
                        autoplay
                    />
                </div>
                
                <h3 className="text-2xl font-bold text-primary mb-3">Opps!</h3>
                <p className="text-primary/60 font-medium leading-relaxed">
                    Hanya bisa satu kali like ya! <br />
                    Terima kasih sudah mendukung proyek ini.
                </p>
                
                <button 
                    onClick={handleClose}
                    className="mt-8 w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-secondary transition-all shadow-lg shadow-primary/20"
                >
                    Siap, Dimengerti!
                </button>
            </div>
        </div>
    );
};

export default LikePopup;
