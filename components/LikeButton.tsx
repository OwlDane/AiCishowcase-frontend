"use client";

import { useState, useEffect } from "react";

interface LikeButtonProps {
    initialLikes: number;
    projectId: string;
    onLike?: (newLikes: number) => void;
    size?: "sm" | "lg";
}

import { api } from "@/lib/api";
import LikePopup from "./LikePopup";

const LikeButton = ({ initialLikes, projectId, onLike, size = "sm" }: LikeButtonProps) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Load liked status from localStorage on mount
    useEffect(() => {
        const likedProjects = JSON.parse(localStorage.getItem('liked_projects') || '[]');
        if (likedProjects.includes(projectId)) {
            setIsLiked(true);
        }
    }, [projectId]);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isLoading) return;

        if (isLiked) {
            setIsPopupOpen(true);
            return;
        }
        
        setIsLoading(true);
        try {
            await api.interactions.like(projectId);
            
            // Success: Update state and localStorage
            const newLikes = likes + 1;
            setLikes(newLikes);
            setIsLiked(true);
            
            const likedProjects = JSON.parse(localStorage.getItem('liked_projects') || '[]');
            if (!likedProjects.includes(projectId)) {
                likedProjects.push(projectId);
                localStorage.setItem('liked_projects', JSON.stringify(likedProjects));
            }
            
            if (onLike) onLike(newLikes);
        } catch (error: any) {
            // Handle "Already Liked" error gracefully
            const isAlreadyLiked = 
                error.status === 400 || 
                error.message?.toLowerCase().includes("already liked");

            if (isAlreadyLiked) {
                setIsLiked(true);
                setIsPopupOpen(true);
                // Also save to localStorage so we don't try again
                const likedProjects = JSON.parse(localStorage.getItem('liked_projects') || '[]');
                if (!likedProjects.includes(projectId)) {
                    likedProjects.push(projectId);
                    localStorage.setItem('liked_projects', JSON.stringify(likedProjects));
                }
            } else {
                console.error("Failed to like project:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isLiked 
                    ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                    : "bg-primary/5 text-primary hover:bg-primary/10"
                } ${size === "lg" ? "text-lg py-3 px-6" : "text-sm"}`}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`transition-transform duration-300 ${size === "lg" ? "h-6 w-6" : "h-4 w-4"} ${isLiked ? "scale-125" : "scale-100"}`} 
                    fill={isLiked ? "currentColor" : "none"} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-bold">{likes}</span>
            </button>

            <LikePopup 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
            />
        </>
    );
};

export default LikeButton;
