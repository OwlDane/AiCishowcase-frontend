
import { researchItems } from "@/data/research";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define PageProps correctly for Next.js 15+ (where params is a Promise)
interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return researchItems.map((item) => ({
        slug: item.slug,
    }));
}

export default async function ResearchDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const item = researchItems.find((i) => i.slug === slug);

    if (!item) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Content Container */}
            <div className="pt-32 lg:pt-40 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Back Button & Breadcrumb */}
                    <div className="mb-8">
                        <Link 
                            href="/riset" 
                            className="inline-flex items-center text-primary font-bold hover:text-secondary transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Riset
                        </Link>
                    </div>

                    {/* Header Info */}
                    <div className="mb-8">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-secondary text-white text-xs font-bold uppercase rounded-full tracking-wider">
                                {item.type}
                            </span>
                            <span className="text-primary/60 font-medium text-sm">
                                {item.date}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                            {item.title}
                        </h1>

                        <div className="flex items-center gap-4 text-primary/80 italic border-l-4 border-secondary pl-4">
                            {item.authors}
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl mb-12">
                        <Image
                            src={item.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600"}
                            alt={item.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 1200px"
                        />
                    </div>

                    {/* Rich Content */}
                    <div className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-bold prose-p:text-primary/80 prose-li:text-primary/80 prose-strong:text-primary">
                        {/* Rendering HTML content */}
                        <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    </div>

                    {/* Tags */}
                    <div className="mt-16 pt-8 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag, idx) => (
                                <span 
                                    key={idx} 
                                    className="px-4 py-2 bg-gray-50 text-primary/70 text-sm font-semibold rounded-full border border-gray-100"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <MapSection />
            <Footer />
        </main>
    );
}
