import Image from "next/image";

const HomeMedia = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Video Profile Section */}
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12">
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/T55aRq874NM" // Video Profile AiCI
                        title="Video Profile AiCI"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Bottom Row: Logos and Virtual Tour */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Partner Logos Card */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 flex items-center justify-center shadow-lg h-[220px]">
                        <div className="flex flex-wrap items-center justify-center gap-12">
                            <Image 
                                src="/icon/umg-idealab.png" 
                                alt="UMG IdeaLab" 
                                width={120} 
                                height={60} 
                                className="h-12 w-auto object-contain"
                            />
                            <Image 
                                src="/icon/ui-logo.png" 
                                alt="Universitas Indonesia" 
                                width={120} 
                                height={60} 
                                className="h-14 w-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Virtual Tour Card */}
                    <div className="relative rounded-3xl overflow-hidden shadow-lg h-[220px] group cursor-pointer">
                        <Image
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800"
                            alt="AiCi Virtual Tour"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h4 className="font-bold text-base mb-1">AiCI - Virtual Tour</h4>
                            <p className="text-xs text-white/80 flex items-center gap-1">
                                Click to explore 
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeMedia;
